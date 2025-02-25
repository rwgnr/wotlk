package deathknight

import (
	"github.com/wowsims/wotlk/sim/core"
	"github.com/wowsims/wotlk/sim/core/proto"
)

var ObliterateActionID = core.ActionID{SpellID: 51425}
var ObliterateMHOutcome = core.OutcomeHit
var ObliterateOHOutcome = core.OutcomeHit

func (deathKnight *DeathKnight) newObliterateHitSpell(isMH bool) *core.Spell {
	guileOfGorefiend := deathKnight.Talents.GuileOfGorefiend > 0

	diseaseConsumptionChance := 1.0
	if deathKnight.Talents.Annihilation == 1 {
		diseaseConsumptionChance = 0.67
	} else if deathKnight.Talents.Annihilation == 2 {
		diseaseConsumptionChance = 0.34
	} else if deathKnight.Talents.Annihilation == 3 {
		diseaseConsumptionChance = 0.0
	}

	hbResetCDChance := 0.05 * float64(deathKnight.Talents.Rime)

	effect := core.SpellEffect{
		BonusCritRating:  (5.0*float64(deathKnight.Talents.Rime) + 3.0*float64(deathKnight.Talents.Subversion) + 1.0*float64(deathKnight.Talents.Annihilation) + deathKnight.scourgeborneCritBonus()) * core.CritRatingPerCritChance,
		DamageMultiplier: core.TernaryFloat64(deathKnight.HasMajorGlyph(proto.DeathKnightMajorGlyph_GlyphOfFrostStrike), 1.25, 1.0),
		ThreatMultiplier: 1,

		BaseDamage: core.BaseDamageConfig{
			Calculator: func(sim *core.Simulation, hitEffect *core.SpellEffect, spell *core.Spell) float64 {
				bonusBaseDamage := deathKnight.sigilOfAwarenessBonus(deathKnight.Obliterate)
				weaponBaseDamage := core.BaseDamageFuncMeleeWeapon(core.MainHand, false, 467.0+bonusBaseDamage, 0.8, true)
				if !isMH {
					weaponBaseDamage = core.BaseDamageFuncMeleeWeapon(core.OffHand, false, 467.0+bonusBaseDamage, 0.8*deathKnight.nervesOfColdSteelBonus(), true)
				}

				return weaponBaseDamage(sim, hitEffect, spell) *
					deathKnight.diseaseMultiplierBonus(hitEffect.Target, 0.125) *
					deathKnight.rageOfRivendareBonus(hitEffect.Target) *
					deathKnight.tundraStalkerBonus(hitEffect.Target) *
					deathKnight.mercilessCombatBonus(sim)
			},
			TargetSpellCoefficient: 1,
		},

		OnSpellHitDealt: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if isMH {
				ObliterateMHOutcome = spellEffect.Outcome
			} else {
				ObliterateOHOutcome = spellEffect.Outcome
			}

			if sim.RandomFloat("Annihilation") < diseaseConsumptionChance {
				deathKnight.FrostFeverDisease[spellEffect.Target.Index].Deactivate(sim)
				deathKnight.BloodPlagueDisease[spellEffect.Target.Index].Deactivate(sim)
			}

			if sim.RandomFloat("Rime") < hbResetCDChance {
				deathKnight.HowlingBlast.CD.Reset()
				deathKnight.HowlingBlastCostless = true
			}
		},
	}

	deathKnight.threatOfThassarianProcMasks(isMH, &effect, guileOfGorefiend)

	return deathKnight.RegisterSpell(core.SpellConfig{
		ActionID:     ObliterateActionID,
		SpellSchool:  core.SpellSchoolPhysical,
		Flags:        core.SpellFlagMeleeMetrics,
		ApplyEffects: core.ApplyEffectFuncDirectDamage(effect),
	})
}

func (deathKnight *DeathKnight) registerObliterateSpell() {
	deathKnight.ObliterateMhHit = deathKnight.newObliterateHitSpell(true)
	deathKnight.ObliterateOhHit = deathKnight.newObliterateHitSpell(false)

	deathKnight.Obliterate = deathKnight.RegisterSpell(core.SpellConfig{
		ActionID:    ObliterateActionID,
		SpellSchool: core.SpellSchoolPhysical,
		Flags:       core.SpellFlagMeleeMetrics,

		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				GCD: core.GCDDefault,
			},
			ModifyCast: func(sim *core.Simulation, spell *core.Spell, cast *core.Cast) {
				cast.GCD = deathKnight.getModifiedGCD()
			},
		},

		ApplyEffects: core.ApplyEffectFuncDirectDamage(core.SpellEffect{
			ProcMask:         core.ProcMaskMeleeMHSpecial,
			ThreatMultiplier: 1,

			OutcomeApplier: deathKnight.OutcomeFuncAlwaysHit(),

			OnSpellHitDealt: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				deathKnight.threatOfThassarianProc(sim, spellEffect, deathKnight.ObliterateMhHit, deathKnight.ObliterateOhHit)
				deathKnight.threatOfThassarianAdjustMetrics(sim, spell, spellEffect, ObliterateMHOutcome)

				if deathKnight.outcomeEitherWeaponHitOrCrit(ObliterateMHOutcome, ObliterateOHOutcome) {
					dkSpellCost := deathKnight.DetermineOptimalCost(sim, 0, 1, 1)
					deathKnight.Spend(sim, spell, dkSpellCost)

					amountOfRunicPower := 15.0 + 2.5*float64(deathKnight.Talents.ChillOfTheGrave) + deathKnight.scourgeborneRunicPowerBonus()
					deathKnight.AddRunicPower(sim, amountOfRunicPower, spell.RunicPowerMetrics())
				}
			},
		}),
	})
}

func (deathKnight *DeathKnight) CanObliterate(sim *core.Simulation) bool {
	return deathKnight.CastCostPossible(sim, 0.0, 0, 1, 1) && deathKnight.Obliterate.IsReady(sim)
}
