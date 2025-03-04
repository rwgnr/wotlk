package paladin

import (
	"time"

	"github.com/wowsims/wotlk/sim/core"
	"github.com/wowsims/wotlk/sim/core/proto"
	"github.com/wowsims/wotlk/sim/core/stats"
)

// TODO:
// Sanctified Wrath
// Judgements of the Wise
// Righteous Vengeance
// Fanatacism threat reduction.

func (paladin *Paladin) ApplyTalents() {
	paladin.AddStat(stats.MeleeCrit, float64(paladin.Talents.Conviction)*core.CritRatingPerCritChance)
	paladin.AddStat(stats.SpellCrit, float64(paladin.Talents.Conviction)*core.CritRatingPerCritChance)
	paladin.AddStat(stats.MeleeCrit, float64(paladin.Talents.SanctityOfBattle)*core.CritRatingPerCritChance)
	paladin.AddStat(stats.SpellCrit, float64(paladin.Talents.SanctityOfBattle)*core.CritRatingPerCritChance)

	paladin.AddStat(stats.Parry, core.ParryRatingPerParryChance*1*float64(paladin.Talents.Deflection))
	paladin.AddStat(stats.Armor, paladin.Equip.Stats()[stats.Armor]*0.02*float64(paladin.Talents.Toughness))
	paladin.AddStat(stats.Defense, core.DefenseRatingPerDefense*4*float64(paladin.Talents.Anticipation))

	if paladin.Talents.DivineStrength > 0 {
		bonus := 1 + 0.03*float64(paladin.Talents.DivineStrength)
		paladin.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.Strength,
			ModifiedStat: stats.Strength,
			Modifier: func(str float64, _ float64) float64 {
				return str * bonus
			},
		})
	}
	if paladin.Talents.DivineIntellect > 0 {
		bonus := 1 + 0.02*float64(paladin.Talents.DivineIntellect)
		paladin.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.Intellect,
			ModifiedStat: stats.Intellect,
			Modifier: func(intellect float64, _ float64) float64 {
				return intellect * bonus
			},
		})
	}

	if paladin.Talents.SheathOfLight > 0 {
		// doesn't implement HOT
		percentage := 0.10 * float64(paladin.Talents.SheathOfLight)
		paladin.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.AttackPower,
			ModifiedStat: stats.SpellPower,
			Modifier: func(attackPower float64, spellPower float64) float64 {
				return spellPower + (attackPower * percentage)
			},
		})
	}

	// if paladin.Talents.ShieldSpecialization > 0 {
	// 	bonus := 1 + 0.1*float64(paladin.Talents.ShieldSpecialization)
	// 	paladin.AddStatDependency(stats.StatDependency{
	// 		SourceStat:   stats.BlockValue,
	// 		ModifiedStat: stats.BlockValue,
	// 		Modifier: func(bv float64, _ float64) float64 {
	// 			return bv * bonus
	// 		},
	// 	})
	// }

	if paladin.Talents.SacredDuty > 0 {
		bonus := 1 + 0.03*float64(paladin.Talents.SacredDuty)
		paladin.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.Stamina,
			ModifiedStat: stats.Stamina,
			Modifier: func(stam float64, _ float64) float64 {
				return stam * bonus
			},
		})
	}

	if paladin.Talents.CombatExpertise > 0 {
		paladin.AddStat(stats.Expertise, core.ExpertisePerQuarterPercentReduction*1*float64(paladin.Talents.CombatExpertise))
		bonus := 1 + 0.02*float64(paladin.Talents.CombatExpertise)
		paladin.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.Stamina,
			ModifiedStat: stats.Stamina,
			Modifier: func(stam float64, _ float64) float64 {
				return stam * bonus
			},
		})
	}

	paladin.applyRedoubt()
	paladin.applyReckoning()
	paladin.applyArdentDefender()
	paladin.applyCrusade()
	paladin.applyWeaponSpecialization()
	paladin.applyVengeance()
	paladin.applyHeartOfTheCrusader()
	paladin.applyArtOfWar()
	paladin.applyJudgmentsOfTheWise()
}

func (paladin *Paladin) applyRedoubt() {
	if paladin.Talents.Redoubt == 0 {
		return
	}

	actionID := core.ActionID{SpellID: 20137}

	bonusBlockRating := 6 * core.BlockRatingPerBlockChance * float64(paladin.Talents.Redoubt)

	procAura := paladin.RegisterAura(core.Aura{
		Label:     "Redoubt Proc",
		ActionID:  actionID,
		Duration:  time.Second * 10,
		MaxStacks: 5,
		OnGain: func(aura *core.Aura, sim *core.Simulation) {
			paladin.AddStatDynamic(sim, stats.Block, bonusBlockRating)
		},
		OnExpire: func(aura *core.Aura, sim *core.Simulation) {
			paladin.AddStatDynamic(sim, stats.Block, -bonusBlockRating)
		},
		OnSpellHitTaken: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spellEffect.Outcome.Matches(core.OutcomeBlock) {
				aura.RemoveStack(sim)
			}
		},
	})

	paladin.RegisterAura(core.Aura{
		Label:    "Redoubt",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitTaken: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spellEffect.Landed() && spellEffect.ProcMask.Matches(core.ProcMaskMeleeOrRanged) {
				if sim.RandomFloat("Redoubt") < 0.1 {
					procAura.Activate(sim)
					procAura.SetStacks(sim, 5)
				}
			}
		},
	})
}

func (paladin *Paladin) applyReckoning() {
	if paladin.Talents.Reckoning == 0 {
		return
	}

	actionID := core.ActionID{SpellID: 20182}
	procChance := 0.02 * float64(paladin.Talents.Reckoning)

	var reckoningSpell *core.Spell

	procAura := paladin.RegisterAura(core.Aura{
		Label:     "Reckoning Proc",
		ActionID:  actionID,
		Duration:  time.Second * 8,
		MaxStacks: 4,
		OnInit: func(aura *core.Aura, sim *core.Simulation) {
			reckoningSpell = paladin.GetOrRegisterSpell(core.SpellConfig{
				ActionID:    actionID,
				SpellSchool: core.SpellSchoolPhysical,
				Flags:       core.SpellFlagMeleeMetrics,

				ApplyEffects: core.ApplyEffectFuncDirectDamage(paladin.AutoAttacks.MHEffect),
			})
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spell == paladin.AutoAttacks.MHAuto {
				reckoningSpell.Cast(sim, spellEffect.Target)
			}
		},
	})

	paladin.RegisterAura(core.Aura{
		Label:    "Reckoning",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitTaken: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if sim.RandomFloat("Redoubt") < procChance {
				procAura.Activate(sim)
				procAura.SetStacks(sim, 4)
			}
		},
	})
}

func (paladin *Paladin) applyArdentDefender() {
	if paladin.Talents.ArdentDefender == 0 {
		return
	}

	actionID := core.ActionID{SpellID: 31854}
	damageReduction := 1.0 - 0.06*float64(paladin.Talents.ArdentDefender)

	procAura := paladin.RegisterAura(core.Aura{
		Label:    "Ardent Defender",
		ActionID: actionID,
		Duration: core.NeverExpires,
		OnGain: func(aura *core.Aura, sim *core.Simulation) {
			aura.Unit.PseudoStats.DamageTakenMultiplier *= damageReduction
		},
		OnExpire: func(aura *core.Aura, sim *core.Simulation) {
			aura.Unit.PseudoStats.DamageTakenMultiplier /= damageReduction
		},
	})

	paladin.RegisterAura(core.Aura{
		Label:    "Ardent Defender Talent",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitTaken: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if aura.Unit.CurrentHealthPercent() < 0.35 {
				procAura.Activate(sim)
			}
		},
	})
}

func (paladin *Paladin) applyCrusade() {
	// TODO: This doesn't account for multiple targets
	paladin.PseudoStats.DamageDealtMultiplier *= paladin.crusadeMultiplier()
}

func (paladin *Paladin) crusadeMultiplier() float64 {
	if paladin.CurrentTarget == nil {
		return 1
	}
	switch paladin.CurrentTarget.MobType {
	case proto.MobType_MobTypeHumanoid, proto.MobType_MobTypeDemon, proto.MobType_MobTypeUndead, proto.MobType_MobTypeElemental:
		return 1 + (0.01 * float64(paladin.Talents.Crusade))
	default:
		return 1
	}
}

// Prior to WOTLK, behavior was to double dip.
func (paladin *Paladin) MeleeCritMultiplier() float64 {
	// return paladin.Character.MeleeCritMultiplier(paladin.crusadeMultiplier(), 0)
	return paladin.DefaultMeleeCritMultiplier()
}
func (paladin *Paladin) SpellCritMultiplier() float64 {
	// return paladin.Character.SpellCritMultiplier(paladin.crusadeMultiplier(), 0)
	return paladin.DefaultSpellCritMultiplier()
}

// Affects all physical damage or spells that can be rolled as physical
// It affects white, Windfury, Crusader Strike, Seals, and Judgement of Command / Blood
func (paladin *Paladin) applyWeaponSpecialization() {
	// This impacts Crusader Strike, Melee Attacks, WF attacks
	// Seals + Judgements need to be implemented separately
	paladin.PseudoStats.PhysicalDamageDealtMultiplier *= paladin.WeaponSpecializationMultiplier()

	mhWeapon := paladin.GetMHWeapon()
	if mhWeapon != nil && mhWeapon.HandType != proto.HandType_HandTypeTwoHand {
		paladin.PseudoStats.DamageDealtMultiplier *= 1 + 0.01*float64(paladin.Talents.OneHandedWeaponSpecialization)
	}
}
func (paladin *Paladin) WeaponSpecializationMultiplier() float64 {
	mhWeapon := paladin.GetMHWeapon()
	if mhWeapon == nil {
		return 1
	}
	if mhWeapon.HandType == proto.HandType_HandTypeTwoHand {
		return 1 + 0.02*float64(paladin.Talents.TwoHandedWeaponSpecialization)
	}
	return 1
}

// I don't know if the new stack of vengeance applies to the crit that triggered it or not
// Need to check this
func (paladin *Paladin) applyVengeance() {
	if paladin.Talents.Vengeance == 0 {
		return
	}

	bonusPerStack := 0.01 * float64(paladin.Talents.Vengeance)
	procAura := paladin.RegisterAura(core.Aura{
		Label:     "Vengeance Proc",
		ActionID:  core.ActionID{SpellID: 20057},
		Duration:  time.Second * 30,
		MaxStacks: 3,
		OnStacksChange: func(aura *core.Aura, sim *core.Simulation, oldStacks int32, newStacks int32) {
			aura.Unit.PseudoStats.DamageDealtMultiplier /= 1 + (bonusPerStack * float64(oldStacks))
			aura.Unit.PseudoStats.DamageDealtMultiplier *= 1 + (bonusPerStack * float64(newStacks))
		},
	})

	paladin.RegisterAura(core.Aura{
		Label:    "Vengeance",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spellEffect.Outcome.Matches(core.OutcomeCrit) {
				procAura.Activate(sim)
				procAura.AddStack(sim)
			}
		},
	})
}

func (paladin *Paladin) applyHeartOfTheCrusader() {
	if paladin.Talents.HeartOfTheCrusader == 0 {
		return
	}

	paladin.RegisterAura(core.Aura{
		Label:    "Heart of the Crusader",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if !spell.Flags.Matches(SpellFlagJudgement) {
				return
			}
			debuffAura := core.HeartoftheCrusaderDebuff(spellEffect.Target, float64(paladin.Talents.HeartOfTheCrusader))
			debuffAura.Activate(sim)
		},
	})
}

func (paladin *Paladin) applyArtOfWar() {
	if paladin.Talents.TheArtOfWar == 0 {
		return
	}

	paladin.ArtOfWarInstantCast = paladin.RegisterAura(core.Aura{
		Label:    "Art Of War",
		ActionID: core.ActionID{SpellID: 53488},
		Duration: time.Second * 15,
	})

	paladin.RegisterAura(core.Aura{
		Label:    "The Art of War",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			// TODO: Check if only procs on white hits.
			if !spellEffect.ProcMask.Matches(core.ProcMaskMeleeWhiteHit) {
				return
			}

			if !spellEffect.Outcome.Matches(core.OutcomeCrit) {
				return
			}

			paladin.ArtOfWarInstantCast.Activate(sim)
		},
	})
}

func (paladin *Paladin) applyJudgmentsOfTheWise() {
	procSpell := paladin.RegisterSpell(core.SpellConfig{
		ActionID: core.ActionID{SpellID: 31878},
		ApplyEffects: func(sim *core.Simulation, unit *core.Unit, _ *core.Spell) {
			if paladin.JowiseManaMetrics == nil {
				paladin.JowiseManaMetrics = paladin.NewManaMetrics(core.ActionID{SpellID: 31878})
			}
			// TODO: actually restore intended mana
			unit.AddMana(sim, unit.BaseMana*0.25, paladin.JowiseManaMetrics, false)
		},
	})

	paladin.RegisterAura(core.Aura{
		Label:    "Judgements of the Wise",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if !spell.Flags.Matches(SpellFlagJudgement) || !spellEffect.Landed() {
				return
			}

			if paladin.Talents.JudgementsOfTheWise == 3 {
				procSpell.Cast(sim, &paladin.Unit)
			} else {
				if sim.RandomFloat("judgements of the wise") > (0.33)*float64(paladin.Talents.JudgementsOfTheWise) {
					return
				}
				procSpell.Cast(sim, &paladin.Unit)
			}
		},
	})
}
