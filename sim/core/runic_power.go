package core

import (
	"time"

	"github.com/wowsims/wotlk/sim/core/proto"
)

type OnBloodRuneGain func(sim *Simulation)
type OnFrostRuneGain func(sim *Simulation)
type OnUnholyRuneGain func(sim *Simulation)
type OnDeathRuneGain func(sim *Simulation)
type OnRunicPowerGain func(sim *Simulation)

type RuneState uint8
type RuneKind uint8

const (
	RuneKind_Undef RuneKind = iota
	RuneKind_Blood
	RuneKind_Frost
	RuneKind_Unholy
	RuneKind_Death
)

const (
	RuneState_Spent RuneState = iota
	RuneState_Normal
	RuneState_DeathSpent
	RuneState_Death
)

type DKRuneCost struct {
	Blood  int
	Frost  int
	Unholy int
	Death  int
}

type Rune struct {
	state                    RuneState
	kind                     RuneKind
	pas                      [2]*PendingAction
	lastRegenTime            time.Duration
	generatedByReapingOrBoTN bool
}

type runicPowerBar struct {
	unit *Unit

	maxRunicPower     float64
	currentRunicPower float64

	bloodRunes  [2]Rune
	frostRunes  [2]Rune
	unholyRunes [2]Rune

	bloodRuneGainMetrics  *ResourceMetrics
	frostRuneGainMetrics  *ResourceMetrics
	unholyRuneGainMetrics *ResourceMetrics
	deathRuneGainMetrics  *ResourceMetrics

	onBloodRuneGain  OnBloodRuneGain
	onFrostRuneGain  OnFrostRuneGain
	onUnholyRuneGain OnUnholyRuneGain
	onDeathRuneGain  OnDeathRuneGain
	onRunicPowerGain OnRunicPowerGain
}

func ResetRune(sim *Simulation, runes *[2]Rune, runeKind RuneKind) {
	runes[0].state = RuneState_Normal
	runes[0].kind = runeKind
	runes[0].lastRegenTime = -1
	runes[0].generatedByReapingOrBoTN = false
	runes[1].state = RuneState_Normal
	runes[1].kind = runeKind
	runes[1].lastRegenTime = -1
	runes[1].generatedByReapingOrBoTN = false

	if runes[0].pas[0] != nil {
		runes[0].pas[0].Cancel(sim)
	}
	runes[0].pas[0] = nil

	if runes[0].pas[1] != nil {
		runes[0].pas[1].Cancel(sim)
	}
	runes[0].pas[1] = nil

	if runes[1].pas[0] != nil {
		runes[1].pas[0].Cancel(sim)
	}
	runes[1].pas[0] = nil

	if runes[1].pas[1] != nil {
		runes[1].pas[1].Cancel(sim)
	}
	runes[1].pas[1] = nil

}

func (rp *runicPowerBar) ResetRunicPowerBar(sim *Simulation) {
	if rp.unit == nil {
		return
	}

	ResetRune(sim, &rp.bloodRunes, RuneKind_Blood)
	ResetRune(sim, &rp.frostRunes, RuneKind_Frost)
	ResetRune(sim, &rp.unholyRunes, RuneKind_Unholy)
}

func (unit *Unit) EnableRunicPowerBar(currentRunicPower float64, maxRunicPower float64,
	onBloodRuneGain OnBloodRuneGain,
	onFrostRuneGain OnFrostRuneGain,
	onUnholyRuneGain OnUnholyRuneGain,
	onDeathRuneGain OnDeathRuneGain,
	onRunicPowerGain OnRunicPowerGain) {
	unit.runicPowerBar = runicPowerBar{
		unit:              unit,
		maxRunicPower:     maxRunicPower,
		currentRunicPower: currentRunicPower,
		bloodRunes:        [2]Rune{Rune{state: RuneState_Normal, kind: RuneKind_Blood, pas: [2]*PendingAction{nil, nil}, lastRegenTime: -1, generatedByReapingOrBoTN: false}, Rune{state: RuneState_Normal, kind: RuneKind_Blood, pas: [2]*PendingAction{nil, nil}, lastRegenTime: -1, generatedByReapingOrBoTN: false}},
		frostRunes:        [2]Rune{Rune{state: RuneState_Normal, kind: RuneKind_Frost, pas: [2]*PendingAction{nil, nil}, lastRegenTime: -1, generatedByReapingOrBoTN: false}, Rune{state: RuneState_Normal, kind: RuneKind_Frost, pas: [2]*PendingAction{nil, nil}, lastRegenTime: -1, generatedByReapingOrBoTN: false}},
		unholyRunes:       [2]Rune{Rune{state: RuneState_Normal, kind: RuneKind_Unholy, pas: [2]*PendingAction{nil, nil}, lastRegenTime: -1, generatedByReapingOrBoTN: false}, Rune{state: RuneState_Normal, kind: RuneKind_Unholy, pas: [2]*PendingAction{nil, nil}, lastRegenTime: -1, generatedByReapingOrBoTN: false}},

		onBloodRuneGain:  onBloodRuneGain,
		onFrostRuneGain:  onFrostRuneGain,
		onUnholyRuneGain: onUnholyRuneGain,
		onDeathRuneGain:  onDeathRuneGain,
		onRunicPowerGain: onRunicPowerGain,
	}

	unit.bloodRuneGainMetrics = unit.NewBloodRuneMetrics(ActionID{OtherID: proto.OtherAction_OtherActionBloodRuneGain, Tag: 1})
	unit.frostRuneGainMetrics = unit.NewFrostRuneMetrics(ActionID{OtherID: proto.OtherAction_OtherActionFrostRuneGain, Tag: 1})
	unit.unholyRuneGainMetrics = unit.NewUnholyRuneMetrics(ActionID{OtherID: proto.OtherAction_OtherActionUnholyRuneGain, Tag: 1})
	unit.deathRuneGainMetrics = unit.NewDeathRuneMetrics(ActionID{OtherID: proto.OtherAction_OtherActionDeathRuneGain, Tag: 1})
}

func (unit *Unit) HasRunicPower() bool {
	return unit.runicPowerBar.unit != nil
}

func (rp *runicPowerBar) BloodRuneGainMetrics() *ResourceMetrics {
	return rp.bloodRuneGainMetrics
}

func (rp *runicPowerBar) FrostRuneGainMetrics() *ResourceMetrics {
	return rp.frostRuneGainMetrics
}

func (rp *runicPowerBar) UnholyRuneGainMetrics() *ResourceMetrics {
	return rp.unholyRuneGainMetrics
}

func (rp *runicPowerBar) DeathRuneGainMetrics() *ResourceMetrics {
	return rp.deathRuneGainMetrics
}

func (rp *runicPowerBar) CurrentRunicPower() float64 {
	return rp.currentRunicPower
}

func (rp *runicPowerBar) addRunicPowerInterval(sim *Simulation, amount float64, metrics *ResourceMetrics) {
	if amount < 0 {
		panic("Trying to add negative runic power!")
	}

	newRunicPower := MinFloat(rp.currentRunicPower+amount, rp.maxRunicPower)
	metrics.AddEvent(amount, newRunicPower-rp.currentRunicPower)

	if sim.Log != nil {
		rp.unit.Log(sim, "Gained %0.3f runic power from %s (%0.3f --> %0.3f).", amount, metrics.ActionID, rp.currentRunicPower, newRunicPower)
	}

	rp.currentRunicPower = newRunicPower
}

func (rp *runicPowerBar) AddRunicPower(sim *Simulation, amount float64, metrics *ResourceMetrics) {
	rp.addRunicPowerInterval(sim, amount, metrics)
	rp.onRunicPowerGain(sim)
}

func (rp *runicPowerBar) SpendRunicPower(sim *Simulation, amount float64, metrics *ResourceMetrics) {
	if amount < 0 {
		panic("Trying to spend negative runic power!")
	}

	newRunicPower := rp.currentRunicPower - amount
	metrics.AddEvent(-amount, -amount)

	if sim.Log != nil {
		rp.unit.Log(sim, "Spent %0.3f runic power from %s (%0.3f --> %0.3f).", amount, metrics.ActionID, rp.currentRunicPower, newRunicPower)
	}

	rp.currentRunicPower = newRunicPower

}

func CurrentRunesOfType(rb *[2]Rune, runeState RuneState) int32 {
	return TernaryInt32(rb[0].state == runeState, 1, 0) + TernaryInt32(rb[1].state == runeState, 1, 0)
}

func RuneReadyAt(sim *Simulation, runes *[2]Rune) time.Duration {
	readyAt := NeverExpires
	pa := runes[0].pas[0]
	if pa != nil {
		readyAt = MinDuration(readyAt, pa.NextActionAt)
	} else {
		return sim.CurrentTime
	}

	pa = runes[1].pas[0]
	if pa != nil {
		readyAt = MinDuration(readyAt, pa.NextActionAt)
	} else {
		return sim.CurrentTime
	}

	return readyAt
}

func NextRuneReadyAt(sim *Simulation, runes *[2]Rune) time.Duration {
	readyAt := NeverExpires
	pa := runes[0].pas[0]
	if pa != nil {
		readyAt = MinDuration(readyAt, pa.NextActionAt)
	}

	pa = runes[1].pas[0]
	if pa != nil {
		readyAt = MinDuration(readyAt, pa.NextActionAt)
	}

	return readyAt
}

func (rp *runicPowerBar) BloodRuneReadyAt(sim *Simulation) time.Duration {
	return RuneReadyAt(sim, &rp.bloodRunes)
}

func (rp *runicPowerBar) FrostRuneReadyAt(sim *Simulation) time.Duration {
	return RuneReadyAt(sim, &rp.frostRunes)
}

func (rp *runicPowerBar) UnholyRuneReadyAt(sim *Simulation) time.Duration {
	return RuneReadyAt(sim, &rp.unholyRunes)
}

func (rp *runicPowerBar) NextBloodRuneReadyAt(sim *Simulation) time.Duration {
	return NextRuneReadyAt(sim, &rp.bloodRunes)
}

func (rp *runicPowerBar) NextFrostRuneReadyAt(sim *Simulation) time.Duration {
	return NextRuneReadyAt(sim, &rp.frostRunes)
}

func (rp *runicPowerBar) NextUnholyRuneReadyAt(sim *Simulation) time.Duration {
	return NextRuneReadyAt(sim, &rp.unholyRunes)
}

func (rp *runicPowerBar) CurrentBloodRunes() int32 {
	return CurrentRunesOfType(&rp.bloodRunes, RuneState_Normal)
}

func (rp *runicPowerBar) CurrentFrostRunes() int32 {
	return CurrentRunesOfType(&rp.frostRunes, RuneState_Normal)
}

func (rp *runicPowerBar) CurrentUnholyRunes() int32 {
	return CurrentRunesOfType(&rp.unholyRunes, RuneState_Normal)
}

func (rp *runicPowerBar) CurrentDeathRunes() int32 {
	return CurrentRunesOfType(&rp.bloodRunes, RuneState_Death) + CurrentRunesOfType(&rp.frostRunes, RuneState_Death) + CurrentRunesOfType(&rp.unholyRunes, RuneState_Death)
}

func (rp *runicPowerBar) CastCostPossible(sim *Simulation, runicPowerAmount float64, bloodAmount int32, frostAmount int32, unholyAmount int32) bool {
	totalDeathRunes := rp.CurrentDeathRunes()

	if rp.CurrentRunicPower() < runicPowerAmount {
		return false
	}

	if rp.CurrentBloodRunes() < bloodAmount {
		if totalDeathRunes > 0 {
			totalDeathRunes -= 1
		} else {
			return false
		}
	}

	if rp.CurrentFrostRunes() < frostAmount {
		if totalDeathRunes > 0 {
			totalDeathRunes -= 1
		} else {
			return false
		}
	}

	if rp.CurrentUnholyRunes() < unholyAmount {
		if totalDeathRunes > 0 {
			totalDeathRunes -= 1
		} else {
			return false
		}
	}

	return true
}

func (rp *runicPowerBar) DetermineOptimalCost(sim *Simulation, bloodAmount int, frostAmount int, unholyAmount int) DKRuneCost {
	totalBloodRunes := int(rp.CurrentBloodRunes())
	startingBloodRunes := totalBloodRunes
	totalFrostRunes := int(rp.CurrentFrostRunes())
	startingFrostRunes := totalFrostRunes
	totalUnholyRunes := int(rp.CurrentUnholyRunes())
	startingUnholyRunes := totalUnholyRunes
	totalDeathRunes := int(rp.CurrentDeathRunes())
	startingDeathRunes := totalDeathRunes

	if int(rp.CurrentBloodRunes()) >= bloodAmount {
		totalBloodRunes -= bloodAmount
	} else {
		totalDeathRunes -= bloodAmount
	}

	if int(rp.CurrentFrostRunes()) >= frostAmount {
		totalFrostRunes -= frostAmount
	} else {
		totalDeathRunes -= frostAmount
	}

	if int(rp.CurrentUnholyRunes()) >= unholyAmount {
		totalUnholyRunes -= unholyAmount
	} else {
		totalDeathRunes -= unholyAmount
	}

	spellCost := DKRuneCost{
		Blood:  startingBloodRunes - totalBloodRunes,
		Frost:  startingFrostRunes - totalFrostRunes,
		Unholy: startingUnholyRunes - totalUnholyRunes,
		Death:  startingDeathRunes - totalDeathRunes,
	}

	return spellCost
}

func (rp *runicPowerBar) Spend(sim *Simulation, spell *Spell, cost DKRuneCost) {
	for i := 0; i < cost.Blood; i++ {
		rp.SpendBloodRune(sim, spell.BloodRuneMetrics())
	}
	for i := 0; i < cost.Frost; i++ {
		rp.SpendFrostRune(sim, spell.FrostRuneMetrics())
	}
	for i := 0; i < cost.Unholy; i++ {
		rp.SpendUnholyRune(sim, spell.UnholyRuneMetrics())
	}
	for i := 0; i < cost.Death; i++ {
		rp.SpendDeathRune(sim, spell.DeathRuneMetrics())
	}
}

func (rp *runicPowerBar) GainRuneMetrics(sim *Simulation, metrics *ResourceMetrics, name string, currRunes int32, newRunes int32) {
	metrics.AddEvent(1, float64(newRunes)-float64(currRunes))

	if sim.Log != nil {
		rp.unit.Log(sim, "Gained 1.000 %s rune from %s (%d --> %d).", name, metrics.ActionID, currRunes, newRunes)
	}
}

func (rp *runicPowerBar) SpendRuneMetrics(sim *Simulation, metrics *ResourceMetrics, name string, currRunes int32, newRunes int32) {
	metrics.AddEvent(-1, -1)

	if sim.Log != nil {
		rp.unit.Log(sim, "Spent 1.000 %s rune from %s (%d --> %d).", name, metrics.ActionID, currRunes, newRunes)
	}
}

func (rp *runicPowerBar) SetRuneToState(r *Rune, runeState RuneState, runeKind RuneKind) {
	// TODO: safeguard this?
	if (r.state == RuneState_Spent || r.state == RuneState_Normal) && (runeState == RuneState_Death || runeState == RuneState_DeathSpent) {
		r.kind = RuneKind_Death
	} else if (r.state == RuneState_DeathSpent || r.state == RuneState_Death) && (runeState != RuneState_Death && runeState != RuneState_DeathSpent) {
		if runeKind == RuneKind_Undef {
			panic("You have to set a rune kind here!")
		}
		r.kind = runeKind
	}

	r.state = runeState
}

func (rp *runicPowerBar) SetRuneAtSlotToState(runeBarIdx int32, slot int32, runeState RuneState, runeKind RuneKind) {
	rb := &rp.bloodRunes
	if runeBarIdx == 1 {
		rb = &rp.frostRunes
	} else if runeBarIdx == 2 {
		rb = &rp.unholyRunes
	}

	// TODO: safeguard this?
	if (rb[slot].state == RuneState_Spent || rb[slot].state == RuneState_Normal) && (runeState == RuneState_Death || runeState == RuneState_DeathSpent) {
		rb[slot].kind = RuneKind_Death
	} else if (rb[slot].state == RuneState_DeathSpent || rb[slot].state == RuneState_Death) && (runeState != RuneState_Death && runeState != RuneState_DeathSpent) {
		if runeKind == RuneKind_Undef {
			panic("You have to set a rune kind here!")
		}
		rb[slot].kind = runeKind
	}

	rb[slot].state = runeState
}

func SetRuneAtSlotToState(rb *[2]Rune, slot int32, runeState RuneState, runeKind RuneKind) {
	// TODO: safeguard this?
	if (rb[slot].state == RuneState_Spent || rb[slot].state == RuneState_Normal) && (runeState == RuneState_Death || runeState == RuneState_DeathSpent) {
		rb[slot].kind = RuneKind_Death
	} else if (rb[slot].state == RuneState_DeathSpent || rb[slot].state == RuneState_Death) && (runeState != RuneState_Death && runeState != RuneState_DeathSpent) {
		if runeKind == RuneKind_Undef {
			panic("You have to set a rune kind here!")
		}
		rb[slot].kind = runeKind
	}

	rb[slot].state = runeState
}

func RegenRuneAndCancelPAs(sim *Simulation, r *Rune) {
	if r.state == RuneState_Spent {
		r.state = RuneState_Normal
	} else if r.state == RuneState_DeathSpent {
		r.state = RuneState_Death
	}

	if r.pas[0] != nil {
		r.lastRegenTime = sim.CurrentTime
		r.pas[0].Cancel(sim)
		r.pas[0] = nil
	}

	if r.pas[1] != nil {
		r.pas[1].Cancel(sim)
		r.pas[1] = nil
	}

	r.generatedByReapingOrBoTN = false
}

func (rp *runicPowerBar) RegenAllRunes(sim *Simulation) {
	RegenRuneAndCancelPAs(sim, &rp.bloodRunes[0])
	RegenRuneAndCancelPAs(sim, &rp.bloodRunes[1])
	RegenRuneAndCancelPAs(sim, &rp.frostRunes[0])
	RegenRuneAndCancelPAs(sim, &rp.frostRunes[1])
	RegenRuneAndCancelPAs(sim, &rp.unholyRunes[0])
	RegenRuneAndCancelPAs(sim, &rp.unholyRunes[1])
}

func (rp *runicPowerBar) GenerateRune(sim *Simulation, r *Rune) {
	if r.state == RuneState_Spent {
		if r.kind == RuneKind_Death {
			panic("Rune has wrong type for state.")
		}
		r.state = RuneState_Normal
		r.lastRegenTime = sim.CurrentTime
	} else if r.state == RuneState_DeathSpent {
		if r.kind != RuneKind_Death {
			panic("Rune has wrong type for state.")
		}
		r.state = RuneState_Death
		r.lastRegenTime = sim.CurrentTime
	}
}

func SpendRuneFromType(rb *[2]Rune, runeState RuneState) int32 {
	spendState := RuneState_Spent
	if runeState == RuneState_Death {
		spendState = RuneState_DeathSpent
	}

	slot := int32(-1)
	if rb[0].state == runeState {
		rb[0].state = spendState
		slot = 0
	} else if rb[1].state == runeState {
		rb[1].state = spendState
		slot = 1
	} else {
		panic("Trying to spend rune that does not exist!")
	}
	return slot
}

func (rp *runicPowerBar) LaunchRuneRegenPA(sim *Simulation, r *Rune) {
	runeGracePeriod := 0.0
	if r.lastRegenTime != -1 {
		runeGracePeriod = MinFloat(2.5, float64((sim.CurrentTime-r.lastRegenTime)/time.Second))
	}
	pa := &PendingAction{
		NextActionAt: sim.CurrentTime + time.Second*time.Duration(10.0-runeGracePeriod),
		Priority:     ActionPriorityRegen,
	}
	pa.OnAction = func(sim *Simulation) {
		if !pa.cancelled {
			r.pas[0] = nil

			currRunes := int32(-1)
			switch r.kind {
			case RuneKind_Blood:
				currRunes = rp.CurrentBloodRunes()
			case RuneKind_Frost:
				currRunes = rp.CurrentFrostRunes()
			case RuneKind_Unholy:
				currRunes = rp.CurrentUnholyRunes()
			case RuneKind_Death:
				currRunes = rp.CurrentDeathRunes()
			}

			rp.GenerateRune(sim, r)

			switch r.kind {
			case RuneKind_Blood:
				rp.GainRuneMetrics(sim, rp.bloodRuneGainMetrics, "blood", currRunes, currRunes+1)
				rp.onBloodRuneGain(sim)
			case RuneKind_Frost:
				rp.GainRuneMetrics(sim, rp.frostRuneGainMetrics, "frost", currRunes, currRunes+1)
				rp.onFrostRuneGain(sim)
			case RuneKind_Unholy:
				rp.GainRuneMetrics(sim, rp.unholyRuneGainMetrics, "unholy", currRunes, currRunes+1)
				rp.onUnholyRuneGain(sim)
			case RuneKind_Death:
				rp.GainRuneMetrics(sim, rp.deathRuneGainMetrics, "death", currRunes, currRunes+1)
				rp.onDeathRuneGain(sim)
			}
		} else {
			r.pas[0] = nil
		}
	}

	r.pas[0] = pa
	sim.AddPendingAction(pa)
}

func (rp *runicPowerBar) SpendBloodRune(sim *Simulation, metrics *ResourceMetrics) int32 {
	currRunes := rp.CurrentBloodRunes()
	if currRunes <= 0 {
		panic("Trying to spend blood runes that don't exist!")
	}

	rp.SpendRuneMetrics(sim, metrics, "blood", currRunes, currRunes-1)
	spendSlot := SpendRuneFromType(&rp.bloodRunes, RuneState_Normal)

	r := &rp.bloodRunes[spendSlot]
	rp.LaunchRuneRegenPA(sim, r)

	return spendSlot
}

func (rp *runicPowerBar) SpendFrostRune(sim *Simulation, metrics *ResourceMetrics) int32 {
	currRunes := rp.CurrentFrostRunes()
	if currRunes <= 0 {
		panic("Trying to spend frost runes that don't exist!")
	}

	rp.SpendRuneMetrics(sim, metrics, "frost", currRunes, currRunes-1)
	spendSlot := SpendRuneFromType(&rp.frostRunes, RuneState_Normal)

	r := &rp.frostRunes[spendSlot]
	rp.LaunchRuneRegenPA(sim, r)

	return spendSlot
}

func (rp *runicPowerBar) SpendUnholyRune(sim *Simulation, metrics *ResourceMetrics) int32 {
	currRunes := rp.CurrentUnholyRunes()
	if currRunes <= 0 {
		panic("Trying to spend unholy runes that don't exist!")
	}

	rp.SpendRuneMetrics(sim, metrics, "unholy", currRunes, currRunes-1)
	spendSlot := SpendRuneFromType(&rp.unholyRunes, RuneState_Normal)

	r := &rp.unholyRunes[spendSlot]
	rp.LaunchRuneRegenPA(sim, r)

	return spendSlot
}

func (rp *runicPowerBar) SpendDeathRune(sim *Simulation, metrics *ResourceMetrics) {
	currRunes := rp.CurrentDeathRunes()
	if currRunes <= 0 {
		panic("Trying to spend death runes that don't exist!")
	}

	rp.SpendRuneMetrics(sim, metrics, "death", currRunes, currRunes-1)

	runeTypeIdx := 0
	spendSlot := SpendRuneFromType(&rp.bloodRunes, RuneState_Death)
	if spendSlot < 0 {
		runeTypeIdx += 1
		spendSlot = SpendRuneFromType(&rp.frostRunes, RuneState_Death)
		if spendSlot < 0 {
			runeTypeIdx += 1
			spendSlot = SpendRuneFromType(&rp.unholyRunes, RuneState_Death)
		}
	}

	r := &rp.bloodRunes[spendSlot]
	if runeTypeIdx == 1 {
		r = &rp.frostRunes[spendSlot]
	} else if runeTypeIdx == 2 {
		r = &rp.unholyRunes[spendSlot]
	}

	if r.generatedByReapingOrBoTN {
		rp.SetRuneToState(r, RuneState_Spent, RuneKind_Blood)
		r.generatedByReapingOrBoTN = false
	}

	rp.LaunchRuneRegenPA(sim, r)

	if r.pas[0] == nil {
		panic("HOW")
	}
}
