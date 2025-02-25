package deathknight

import (
	"github.com/wowsims/wotlk/sim/core"
	"github.com/wowsims/wotlk/sim/core/proto"
)

var PestilenceLastOutcomes []core.HitOutcome

func (deathKnight *DeathKnight) registerPestilenceSpell() {
	PestilenceLastOutcomes = make([]core.HitOutcome, deathKnight.Env.GetNumTargets())

	deathKnight.Pestilence = deathKnight.RegisterSpell(core.SpellConfig{
		ActionID:    core.ActionID{SpellID: 50842},
		SpellSchool: core.SpellSchoolShadow,

		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				GCD: core.GCDDefault,
			},
			ModifyCast: func(sim *core.Simulation, spell *core.Spell, cast *core.Cast) {
				cast.GCD = deathKnight.getModifiedGCD()
			},
		},

		ApplyEffects: core.ApplyEffectFuncAOEDamage(deathKnight.Env, core.SpellEffect{
			ProcMask:             core.ProcMaskSpellDamage,
			BonusSpellCritRating: 0.0,
			DamageMultiplier:     0.0,
			ThreatMultiplier:     0.0,

			// Zero damage spell with a Hit mechanic, thanks blizz!
			BaseDamage:     core.BaseDamageConfigFlat(0),
			OutcomeApplier: deathKnight.OutcomeFuncMagicHit(),

			OnSpellHitDealt: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				PestilenceLastOutcomes[deathKnight.getIndexForTarget(spellEffect.Target)] = spellEffect.Outcome
				if spellEffect.Landed() {
					unitHit := spellEffect.Target
					// Main target
					if unitHit == deathKnight.CurrentTarget {
						if deathKnight.HasMajorGlyph(proto.DeathKnightMajorGlyph_GlyphOfDisease) {
							// Update expire instead of Apply to keep old snapshotted value
							deathKnight.FrostFeverDisease[unitHit.Index].UpdateExpires(sim.CurrentTime + deathKnight.FrostFeverDisease[unitHit.Index].Duration)
							deathKnight.BloodPlagueDisease[unitHit.Index].UpdateExpires(sim.CurrentTime + deathKnight.BloodPlagueDisease[unitHit.Index].Duration)
						}

						dkSpellCost := deathKnight.DetermineOptimalCost(sim, 1, 0, 0)
						deathKnight.Spend(sim, spell, dkSpellCost)

						amountOfRunicPower := 10.0 + 2.5*float64(deathKnight.Talents.ChillOfTheGrave)
						deathKnight.AddRunicPower(sim, amountOfRunicPower, spell.RunicPowerMetrics())
					} else {
						// Apply diseases on every other target
						// TODO: Snapshot the current values of main target disease and roll over to off targets
						if deathKnight.TargetHasDisease(FrostFeverAuraLabel, deathKnight.CurrentTarget) {
							deathKnight.FrostFeverDisease[unitHit.Index].Apply(sim)
						}
						if deathKnight.TargetHasDisease(FrostFeverAuraLabel, deathKnight.CurrentTarget) {
							deathKnight.BloodPlagueDisease[unitHit.Index].Apply(sim)
						}
					}
				}
			},
		}),
	})
}

func (deathKnight *DeathKnight) CanPestilence(sim *core.Simulation) bool {
	return deathKnight.CastCostPossible(sim, 0.0, 1, 0, 0) && deathKnight.Pestilence.IsReady(sim)
}
