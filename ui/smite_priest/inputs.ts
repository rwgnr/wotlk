import { SmitePriest_Rotation_RotationType as RotationType } from '/wotlk/core/proto/priest.js';
import { Race, RaidTarget } from '/wotlk/core/proto/common.js';
import { Spec } from '/wotlk/core/proto/common.js';
import { NO_TARGET } from '/wotlk/core/proto_utils/utils.js';
import { ActionId } from '/wotlk/core/proto_utils/action_id.js';
import { Player } from '/wotlk/core/player.js';
import { Sim } from '/wotlk/core/sim.js';
import { IndividualSimUI } from '/wotlk/core/individual_sim_ui.js';
import { Target } from '/wotlk/core/target.js';
import { EventID, TypedEvent } from '/wotlk/core/typed_event.js';

// Configuration for spec-specific UI elements on the settings tab.
// These don't need to be in a separate file but it keeps things cleaner.

export const SelfPowerInfusion = {
	id: ActionId.fromSpellId(10060),
	states: 2,
	extraCssClasses: [
		'self-power-infusion-picker',
		'within-raid-sim-hide',
	],
	changedEvent: (player: Player<Spec.SpecSmitePriest>) => player.specOptionsChangeEmitter,
	getValue: (player: Player<Spec.SpecSmitePriest>) => player.getSpecOptions().powerInfusionTarget?.targetIndex != NO_TARGET,
	setValue: (eventID: EventID, player: Player<Spec.SpecSmitePriest>, newValue: boolean) => {
		const newOptions = player.getSpecOptions();
		newOptions.powerInfusionTarget = RaidTarget.create({
			targetIndex: newValue ? 0 : NO_TARGET,
		});
		player.setSpecOptions(eventID, newOptions);
	},
};

export const SmitePriestRotationConfig = {
	inputs: [
		{
			type: 'enum' as const, cssClass: 'rotation-enum-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Rotation Type',
				labelTooltip: 'Choose whether to weave optionally weave holy fire for increase Shadow Word: Pain uptime',
				values: [
					{
						name: 'Basic', value: RotationType.Basic,
					},
					{
						name: 'HF Weave', value: RotationType.HolyFireWeave,
					},
				],
				changedEvent: (player: Player<Spec.SpecSmitePriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecSmitePriest>) => player.getRotation().rotationType,
				setValue: (eventID: EventID, player: Player<Spec.SpecSmitePriest>, newValue: number) => {
					const newRotation = player.getRotation();
					newRotation.rotationType = newValue;
					player.setRotation(eventID, newRotation);
				},
			},
		},
		{
			type: 'boolean' as const,
			cssClass: 'shadowfiend-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Use Shadowfiend',
				labelTooltip: 'Use Shadowfiend when low mana and off CD.',
				changedEvent: (player: Player<Spec.SpecSmitePriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecSmitePriest>) => player.getSpecOptions().useShadowfiend,
				setValue: (eventID: EventID, player: Player<Spec.SpecSmitePriest>, newValue: boolean) => {
					const newOptions = player.getSpecOptions();
					newOptions.useShadowfiend = newValue;
					player.setSpecOptions(eventID, newOptions);
				},
			},
		},
		{
			type: 'boolean' as const,
			cssClass: 'mindblast-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Use Mind Blast',
				labelTooltip: 'Use Mind Blast whenever off CD.',
				changedEvent: (player: Player<Spec.SpecSmitePriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecSmitePriest>) => player.getRotation().useMindBlast,
				setValue: (eventID: EventID, player: Player<Spec.SpecSmitePriest>, newValue: boolean) => {
					const newRotation = player.getRotation();
					newRotation.useMindBlast = newValue;
					player.setRotation(eventID, newRotation);
				},
			},
		},
		{
			type: 'boolean' as const,
			cssClass: 'swd-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Use Shadow Word: Death',
				labelTooltip: 'Use Shadow Word: Death whenever off CD.',
				changedEvent: (player: Player<Spec.SpecSmitePriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecSmitePriest>) => player.getRotation().useShadowWordDeath,
				setValue: (eventID: EventID, player: Player<Spec.SpecSmitePriest>, newValue: boolean) => {
					const newRotation = player.getRotation();
					newRotation.useShadowWordDeath = newValue;
					player.setRotation(eventID, newRotation);
				},
			},
		},
	],
};
