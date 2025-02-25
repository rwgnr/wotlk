package paladin

import (
	"time"

	"github.com/wowsims/wotlk/sim/core"
	"github.com/wowsims/wotlk/sim/core/proto"
	"github.com/wowsims/wotlk/sim/core/stats"
)

func (paladin *Paladin) registerExorcismSpell() {
	// From the perspective of max rank.
	baseCost := paladin.BaseMana * 0.08

	baseMultiplier := 1.0
	baseMultiplier += 0.05 * float64(paladin.Talents.SanctityOfBattle)

	scaling := hybridScaling{
		AP: 0.15,
		SP: 0.15,
	}

	paladin.Exorcism = paladin.RegisterSpell(core.SpellConfig{
		ActionID:    core.ActionID{SpellID: 48801},
		SpellSchool: core.SpellSchoolHoly,

		ResourceType: stats.Mana,
		BaseCost:     baseCost,

		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				Cost: baseCost,
				GCD:  core.GCDDefault,
			},
			CD: core.Cooldown{
				Timer:    paladin.NewTimer(),
				Duration: time.Second * 15,
			},
			ModifyCast: func(sim *core.Simulation, spell *core.Spell, cast *core.Cast) {
				if paladin.ArtOfWarInstantCast.IsActive() {
					paladin.ArtOfWarInstantCast.Deactivate(sim)
					cast.CastTime = 0
					cast.Cost = cast.Cost * (1 - 0.02*float64(paladin.Talents.Benediction))
				}
			},
		},

		ApplyEffects: core.ApplyEffectFuncDirectDamage(core.SpellEffect{
			ProcMask: core.ProcMaskSpellDamage,

			DamageMultiplier: baseMultiplier,
			ThreatMultiplier: 1,

			BaseDamage: core.BaseDamageConfig{
				Calculator: func(sim *core.Simulation, hitEffect *core.SpellEffect, spell *core.Spell) float64 {
					// TODO: discuss exporting or adding to core for damageRollOptimized hybrid scaling.
					deltaDamage := 1146.0 - 1028.0
					damage := 1028.0 + deltaDamage*sim.RandomFloat("Damage Roll")
					damage += hitEffect.SpellPower(spell.Unit, spell) * scaling.SP
					damage += hitEffect.MeleeAttackPower(spell.Unit) * scaling.AP
					return damage
				},
			},
			// look up crit multiplier in the future
			// TODO: What is this 0.25?
			OutcomeApplier: paladin.OutcomeFuncMagicHitAndCrit(paladin.SpellCritMultiplier()),
		}),
	})
}

func (paladin *Paladin) CanExorcism(target *core.Unit) bool {
	return target.MobType == proto.MobType_MobTypeUndead || target.MobType == proto.MobType_MobTypeDemon
}
