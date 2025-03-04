package deathknight

import (
	"time"

	"github.com/wowsims/wotlk/sim/core"
)

func (deathKnight *DeathKnight) registerEmpowerRuneWeaponSpell() {
	actionID := core.ActionID{SpellID: 47568}
	cdTimer := deathKnight.NewTimer()
	cd := time.Minute * 5

	deathKnight.EmpowerRuneWeapon = deathKnight.RegisterSpell(core.SpellConfig{
		ActionID: actionID,
		Flags:    core.SpellFlagNoOnCastComplete,

		Cast: core.CastConfig{
			CD: core.Cooldown{
				Timer:    cdTimer,
				Duration: cd,
			},
		},
		ApplyEffects: func(sim *core.Simulation, target *core.Unit, spell *core.Spell) {
			blood := deathKnight.CurrentBloodRunes()
			frost := deathKnight.CurrentFrostRunes()
			unholy := deathKnight.CurrentUnholyRunes()

			deathKnight.RegenAllRunes(sim)

			deathKnight.GainRuneMetrics(sim, deathKnight.EmpowerRuneWeapon.BloodRuneMetrics(), "blood", blood, deathKnight.CurrentBloodRunes())
			deathKnight.GainRuneMetrics(sim, deathKnight.EmpowerRuneWeapon.FrostRuneMetrics(), "frost", frost, deathKnight.CurrentFrostRunes())
			deathKnight.GainRuneMetrics(sim, deathKnight.EmpowerRuneWeapon.UnholyRuneMetrics(), "unholy", unholy, deathKnight.CurrentUnholyRunes())

			amountOfRunicPower := 25.0
			deathKnight.AddRunicPower(sim, amountOfRunicPower, deathKnight.EmpowerRuneWeapon.RunicPowerMetrics())
		},
	})
}

func (deathKnight *DeathKnight) CanEmpowerRuneWeapon(sim *core.Simulation) bool {
	return deathKnight.EmpowerRuneWeapon.IsReady(sim)
}
