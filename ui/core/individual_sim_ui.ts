import { BattleElixir } from '/wotlk/core/proto/common.js';
import { BonusStatsPicker } from '/wotlk/core/components/bonus_stats_picker.js';
import { BooleanPicker, BooleanPickerConfig } from '/wotlk/core/components/boolean_picker.js';
import { CharacterStats, StatMods } from '/wotlk/core/components/character_stats.js';
import { Class } from '/wotlk/core/proto/common.js';
import { Conjured } from '/wotlk/core/proto/common.js';
import { Consumes } from '/wotlk/core/proto/common.js';
import { Cooldowns } from '/wotlk/core/proto/common.js';
import { CooldownsPicker } from '/wotlk/core/components/cooldowns_picker.js';
import { Debuffs } from '/wotlk/core/proto/common.js';
import { DetailedResults } from '/wotlk/core/components/detailed_results.js';

import { Encounter as EncounterProto } from '/wotlk/core/proto/common.js';
import { Encounter } from './encounter.js';
import { EncounterPicker, EncounterPickerConfig } from '/wotlk/core/components/encounter_picker.js';
import { EnumPicker, EnumPickerConfig } from '/wotlk/core/components/enum_picker.js';
import { EquipmentSpec } from '/wotlk/core/proto/common.js';
import { EventID, TypedEvent } from './typed_event.js';
import { Flask } from '/wotlk/core/proto/common.js';
import { Food } from '/wotlk/core/proto/common.js';
import { Gear } from '/wotlk/core/proto_utils/gear.js';
import { GearPicker } from '/wotlk/core/components/gear_picker.js';
import { Glyphs } from '/wotlk/core/proto/common.js';
import { GuardianElixir } from '/wotlk/core/proto/common.js';
import { HealingModel } from '/wotlk/core/proto/common.js';
import { HunterPetTalentsPicker } from '/wotlk/core/talents/hunter_pet.js';
import { IconEnumPicker, IconEnumPickerConfig } from '/wotlk/core/components/icon_enum_picker.js';
import { IconPicker, IconPickerConfig } from '/wotlk/core/components/icon_picker.js';
import { ItemSlot } from '/wotlk/core/proto/common.js';
import { IndividualBuffs } from '/wotlk/core/proto/common.js';
import { IndividualSimSettings } from '/wotlk/core/proto/ui.js';
import { Input } from '/wotlk/core/components/input.js';
import { LogRunner } from '/wotlk/core/components/log_runner.js';
import { MobType } from '/wotlk/core/proto/common.js';
import { MultiIconPicker } from '/wotlk/core/components/multi_icon_picker.js';
import { NumberPicker, NumberPickerConfig } from '/wotlk/core/components/number_picker.js';
import { Party } from './party.js';
import { PartyBuffs } from '/wotlk/core/proto/common.js';
import { PetFood } from '/wotlk/core/proto/common.js';
import { Player as PlayerProto } from '/wotlk/core/proto/api.js';
import { Player } from './player.js';
import { Potions } from '/wotlk/core/proto/common.js';
import { Profession } from '/wotlk/core/proto/common.js';
import { Race } from '/wotlk/core/proto/common.js';
import { Raid } from './raid.js';
import { RaidBuffs } from '/wotlk/core/proto/common.js';
import { SavedDataConfig, SavedDataManager } from '/wotlk/core/components/saved_data_manager.js';
import { SavedEncounter } from '/wotlk/core/proto/ui.js';
import { SavedGearSet } from '/wotlk/core/proto/ui.js';
import { SavedSettings } from '/wotlk/core/proto/ui.js';
import { SavedTalents } from '/wotlk/core/proto/ui.js';
import { SettingsMenu } from '/wotlk/core/components/settings_menu.js';
import { ShattrathFaction } from '/wotlk/core/proto/common.js';
import { Sim } from './sim.js';
import { SimOptions } from '/wotlk/core/proto/api.js';
import { SimSettings as SimSettingsProto } from '/wotlk/core/proto/ui.js';
import { SimUI, SimWarning } from './sim_ui.js';
import { Spec } from '/wotlk/core/proto/common.js';
import { SpecOptions } from '/wotlk/core/proto_utils/utils.js';
import { SpecRotation } from '/wotlk/core/proto_utils/utils.js';
import { Stat } from '/wotlk/core/proto/common.js';
import { StatWeightsRequest, StatWeightsResult } from '/wotlk/core/proto/api.js';
import { Stats } from '/wotlk/core/proto_utils/stats.js';
import { shattFactionNames } from '/wotlk/core/proto_utils/names.js';
import { Target } from './target.js';
import { Target as TargetProto } from '/wotlk/core/proto/common.js';
import { WeaponImbue } from '/wotlk/core/proto/common.js';
import { addRaidSimAction, RaidSimResultsManager } from '/wotlk/core/components/raid_sim_action.js';
import { addStatWeightsAction } from '/wotlk/core/components/stat_weights_action.js';
import { equalsOrBothNull, getEnumValues } from '/wotlk/core/utils.js';
import { getMetaGemConditionDescription } from '/wotlk/core/proto_utils/gems.js';
import { isDualWieldSpec } from '/wotlk/core/proto_utils/utils.js';
import { launchedSpecs } from '/wotlk/core/launched_sims.js';
import { makePetTypeInputConfig } from '/wotlk/core/talents/hunter_pet.js';
import { newIndividualExporters } from '/wotlk/core/components/exporters.js';
import { newIndividualImporters } from '/wotlk/core/components/importers.js';
import { newGlyphsPicker } from '/wotlk/core/talents/factory.js';
import { newTalentsPicker } from '/wotlk/core/talents/factory.js';
import { professionNames, raceNames } from '/wotlk/core/proto_utils/names.js';
import { isTankSpec } from '/wotlk/core/proto_utils/utils.js';
import { specNames } from '/wotlk/core/proto_utils/utils.js';
import { specToEligibleRaces } from '/wotlk/core/proto_utils/utils.js';
import { specToLocalStorageKey } from '/wotlk/core/proto_utils/utils.js';

import * as IconInputs from '/wotlk/core/components/icon_inputs.js';
import * as OtherConstants from '/wotlk/core/constants/other.js';
import * as Tooltips from '/wotlk/core/constants/tooltips.js';

declare var Muuri: any;
declare var tippy: any;
declare var pako: any;

const SAVED_GEAR_STORAGE_KEY = '__savedGear__';
const SAVED_ROTATION_STORAGE_KEY = '__savedRotation__';
const SAVED_SETTINGS_STORAGE_KEY = '__savedSettings__';
const SAVED_TALENTS_STORAGE_KEY = '__savedTalents__';

export type IndividualSimIconPickerConfig<ModObject, ValueType> = (IconPickerConfig<ModObject, ValueType> | IconEnumPickerConfig<ModObject, ValueType>) & {
	// If set, all effects with matching tags will be deactivated when this
	// effect is enabled.
	exclusivityTags?: Array<ExclusivityTag>;
};

class IndividualSimIconPicker<ModObject, ValueType> {
	constructor(parent: HTMLElement, modObj: ModObject, input: IndividualSimIconPickerConfig<ModObject, ValueType>, simUI: IndividualSimUI<any>) {
		let picker: Input<ModObject, ValueType> | null = null;
		if ('states' in input) {
			picker = new IconPicker<ModObject, ValueType>(parent, modObj, input);
		} else {
			picker = new IconEnumPicker<ModObject, ValueType>(parent, modObj, input);
		}

		if (input.exclusivityTags) {
			simUI.registerExclusiveEffect({
				tags: input.exclusivityTags,
				changedEvent: picker!.changeEmitter,
				isActive: () => Boolean(picker!.getInputValue()),
				deactivate: (eventID: EventID) => picker!.setValue(eventID, (typeof picker!.getInputValue() == 'number') ? 0 as unknown as ValueType : false as unknown as ValueType),
			});
		}
	}
}

export type InputConfig = {
	type: 'boolean',
	getModObject: (simUI: IndividualSimUI<any>) => any,
	config: BooleanPickerConfig<any>,
} |
{
	type: 'number',
	getModObject: (simUI: IndividualSimUI<any>) => any,
	config: NumberPickerConfig<any>,
} |
{
	type: 'enum',
	getModObject: (simUI: IndividualSimUI<any>) => any,
	config: EnumPickerConfig<any>,
} |
{
	type: 'iconEnum',
	getModObject: (simUI: IndividualSimUI<any>) => any,
	config: IconEnumPickerConfig<any, any>,
};


export interface InputSection {
	tooltip?: string,
	inputs: Array<InputConfig>,
}

export interface IndividualSimUIConfig<SpecType extends Spec> {
	// Additional css class to add to the root element.
	cssClass: string,

	knownIssues?: Array<string>;
	warnings?: Array<(simUI: IndividualSimUI<SpecType>) => SimWarning>,

	epStats: Array<Stat>;
	epReferenceStat: Stat;
	displayStats: Array<Stat>;
	modifyDisplayStats?: (player: Player<SpecType>) => StatMods,

	defaults: {
		gear: EquipmentSpec,
		epWeights: Stats,
		consumes: Consumes,
		rotation: SpecRotation<SpecType>,
		talents: SavedTalents,
		specOptions: SpecOptions<SpecType>,

		raidBuffs: RaidBuffs,
		partyBuffs: PartyBuffs,
		individualBuffs: IndividualBuffs,

		debuffs: Debuffs,
	},

	selfBuffInputs: Array<IndividualSimIconPickerConfig<Player<any>, any>>,
	petInputs?: Array<IndividualSimIconPickerConfig<Player<any>, any>>,
	weaponImbueInputs?: Array<IndividualSimIconPickerConfig<Player<any>, any>>,
	rotationInputs: InputSection;
	spellInputs?: Array<IndividualSimIconPickerConfig<Player<any>, any>>;
	otherInputs?: InputSection;

	// Extra UI sections with the same input config as other sections.
	additionalSections?: Record<string, InputSection>;
	additionalIconSections?: Record<string, Array<IndividualSimIconPickerConfig<Player<any>, any>>>;

	// For when extra sections are needed, with even more flexibility than additionalSections.
	// Return value is the label for the section.
	customSections?: Array<(simUI: IndividualSimUI<SpecType>, parentElem: HTMLElement) => string>;

	encounterPicker: EncounterPickerConfig,

	presets: {
		gear: Array<PresetGear>,
		talents: Array<SavedDataConfig<Player<any>, SavedTalents>>,
		rotation?: Array<SavedDataConfig<Player<any>, string>>,
	},
}

export interface GearAndStats {
	gear: Gear,
	bonusStats?: Stats,
}

export interface PresetGear {
	name: string;
	gear: EquipmentSpec;
	tooltip?: string;
	enableWhen?: (obj: Player<any>) => boolean;
}

export interface Settings {
	raidBuffs: RaidBuffs,
	partyBuffs: PartyBuffs,
	individualBuffs: IndividualBuffs,
	consumes: Consumes,
	race: Race,
}

// Extended shared UI for all individual player sims.
export abstract class IndividualSimUI<SpecType extends Spec> extends SimUI {
	readonly player: Player<SpecType>;
	readonly individualConfig: IndividualSimUIConfig<SpecType>;

	private readonly exclusivityMap: Record<ExclusivityTag, Array<ExclusiveEffect>>;

	private raidSimResultsManager: RaidSimResultsManager | null;

	private settingsMuuri: any;

	prevEpIterations: number;
	prevEpSimResult: StatWeightsResult | null;

	constructor(parentElem: HTMLElement, player: Player<SpecType>, config: IndividualSimUIConfig<SpecType>) {
		super(parentElem, player.sim, {
			spec: player.spec,
			knownIssues: config.knownIssues,
		});
		this.rootElem.classList.add('individual-sim-ui', config.cssClass);
		this.player = player;
		this.individualConfig = config;
		this.raidSimResultsManager = null;
		this.settingsMuuri = null;
		this.prevEpIterations = 0;
		this.prevEpSimResult = null;

		if (!launchedSpecs.includes(this.player.spec)) {
			this.addWarning({
				updateOn: new TypedEvent<void>(),
				getContent: () => {
					if (this.player.getClass() == Class.ClassWarlock) {
						return 'This sim is under current development for Wrath of the Lich King. Talents and Glyphs are mostly ready but rotations are under development.';
					} else {
						return 'This sim has not yet been updated from its TBC state.';
					}
				},
			});
		}

		this.addWarning({
			updateOn: this.player.gearChangeEmitter,
			getContent: () => {
				if (!this.player.getGear().hasInactiveMetaGem()) {
					return '';
				}

				const metaGem = this.player.getGear().getMetaGem()!;
				return `Meta gem disabled (${metaGem.name}): ${getMetaGemConditionDescription(metaGem)}`;
			},
		});
		this.addWarning({
			updateOn: TypedEvent.onAny([this.player.gearChangeEmitter, this.player.professionChangeEmitter]),
			getContent: () => {
				const failedProfReqs = this.player.getGear().getFailedProfessionRequirements(this.player.getProfessions());
				if (failedProfReqs.length == 0) {
					return '';
				}

				return failedProfReqs.map(fpr => `${fpr.name} requires ${professionNames[fpr.requiredProfession]}, but it is not selected.`);
			},
		});
		this.addWarning({
			updateOn: this.player.gearChangeEmitter,
			getContent: () => {
				const jcGems = this.player.getGear().getJCGems();
				if (jcGems.length <= 3) {
					return '';
				}

				return `Only 3 Jewelcrafting Gems are allowed, but ${jcGems.length} are equipped.`;
			},
		});
		(config.warnings || []).forEach(warning => this.addWarning(warning(this)));

		this.exclusivityMap = {
			'Battle Elixir': [],
			'Drums': [],
			'Food': [],
			'Pet Food': [],
			'Guardian Elixir': [],
			'Potion': [],
			'Conjured': [],
			'Spirit': [],
			'MH Weapon Imbue': [],
			'OH Weapon Imbue': [],
		};

		if (!this.isWithinRaidSim) {
			// This needs to go before all the UI components so that gear loading is the
			// first callback invoked from waitForInit().
			this.sim.waitForInit().then(() => this.loadSettings());
		}

		this.addSidebarComponents();
		this.addTopbarComponents();
		this.addGearTab();
		this.addSettingsTab();
		this.addTalentsTab();

		if (!this.isWithinRaidSim) {
			this.addDetailedResultsTab();
			this.addLogTab();
		}

		this.player.changeEmitter.on(() => this.recomputeSettingsLayout());
	}

	private loadSettings() {
		const initEventID = TypedEvent.nextEventID();
		TypedEvent.freezeAllAndDo(() => {
			let loadedSettings = false;

			let hash = window.location.hash;
			if (hash.length > 1) {
				// Remove leading '#'
				hash = hash.substring(1);
				try {
					const binary = atob(hash);
					const bytes = new Uint8Array(binary.length);
					for (let i = 0; i < bytes.length; i++) {
						bytes[i] = binary.charCodeAt(i);
					}

					const settingsBytes = pako.inflate(bytes);
					const settings = IndividualSimSettings.fromBinary(settingsBytes);
					this.fromProto(initEventID, settings);
					loadedSettings = true;
				} catch (e) {
					console.warn('Failed to parse settings from window hash: ' + e);
				}
			}
			window.location.hash = '';

			const savedSettings = window.localStorage.getItem(this.getSettingsStorageKey());
			if (!loadedSettings && savedSettings != null) {
				try {
					const settings = IndividualSimSettings.fromJsonString(savedSettings);
					this.fromProto(initEventID, settings);
					loadedSettings = true;
				} catch (e) {
					console.warn('Failed to parse saved settings: ' + e);
				}
			}

			if (!loadedSettings) {
				this.applyDefaults(initEventID);
			}
			this.player.setName(initEventID, 'Player');

			// This needs to go last so it doesn't re-store things as they are initialized.
			this.changeEmitter.on(eventID => {
				const jsonStr = IndividualSimSettings.toJsonString(this.toProto());
				window.localStorage.setItem(this.getSettingsStorageKey(), jsonStr);
			});
		});
	}

	private addSidebarComponents() {
		this.raidSimResultsManager = addRaidSimAction(this);
		addStatWeightsAction(this, this.individualConfig.epStats, this.individualConfig.epReferenceStat);

		const characterStats = new CharacterStats(
			this.rootElem.getElementsByClassName('sim-sidebar-footer')[0] as HTMLElement,
			this.player,
			this.individualConfig.displayStats,
			this.individualConfig.modifyDisplayStats);
	}

	private addTopbarComponents() {
		this.addToolbarItem(newIndividualImporters(this));
		this.addToolbarItem(newIndividualExporters(this));

		const optionsMenu = document.createElement('span');
		optionsMenu.classList.add('fas', 'fa-cog');
		tippy(optionsMenu, {
			'content': 'Options',
			'allowHTML': true,
		});
		optionsMenu.addEventListener('click', event => {
			new SettingsMenu(this.rootElem, this);
		});
		this.addToolbarItem(optionsMenu);
	}

	private addGearTab() {
		this.addTab('GEAR', 'gear-tab', `
			<div class="gear-tab-columns">
				<div class="left-gear-panel">
					<div class="gear-picker">
					</div>
				</div>
				<div class="right-gear-panel">
					<div class="bonus-stats-picker">
					</div>
					<div class="saved-gear-manager">
					</div>
				</div>
			</div>
		`);

		const gearPicker = new GearPicker(this.rootElem.getElementsByClassName('gear-picker')[0] as HTMLElement, this.player);
		const bonusStatsPicker = new BonusStatsPicker(this.rootElem.getElementsByClassName('bonus-stats-picker')[0] as HTMLElement, this.player, this.individualConfig.epStats);

		const savedGearManager = new SavedDataManager<Player<any>, SavedGearSet>(this.rootElem.getElementsByClassName('saved-gear-manager')[0] as HTMLElement, this.player, {
			label: 'Gear',
			storageKey: this.getSavedGearStorageKey(),
			getData: (player: Player<any>) => {
				return SavedGearSet.create({
					gear: player.getGear().asSpec(),
					bonusStats: player.getBonusStats().asArray(),
				});
			},
			setData: (eventID: EventID, player: Player<any>, newSavedGear: SavedGearSet) => {
				TypedEvent.freezeAllAndDo(() => {
					player.setGear(eventID, this.sim.lookupEquipmentSpec(newSavedGear.gear || EquipmentSpec.create()));
					player.setBonusStats(eventID, new Stats(newSavedGear.bonusStats || []));
				});
			},
			changeEmitters: [this.player.changeEmitter],
			equals: (a: SavedGearSet, b: SavedGearSet) => SavedGearSet.equals(a, b),
			toJson: (a: SavedGearSet) => SavedGearSet.toJson(a),
			fromJson: (obj: any) => SavedGearSet.fromJson(obj),
		});

		this.sim.waitForInit().then(() => {
			savedGearManager.loadUserData();
			this.individualConfig.presets.gear.forEach(presetGear => {
				savedGearManager.addSavedData({
					name: presetGear.name,
					tooltip: presetGear.tooltip,
					isPreset: true,
					data: SavedGearSet.create({
						// Convert to gear and back so order is always the same.
						gear: this.sim.lookupEquipmentSpec(presetGear.gear).asSpec(),
						bonusStats: new Stats().asArray(),
					}),
					enableWhen: presetGear.enableWhen,
				});
			});
		});
	}


	private addSettingsTab() {
		var petsSelectionSection=``
		if (this.individualConfig.petInputs?.length) {
			petsSelectionSection=`
			   <fieldset class="settings-section pets-section">
					<legend>Pets</legend>
				</fieldset>`
		}
		
		var spellSection=``
		if (this.individualConfig.spellInputs?.length) {
			spellSection=`
			    <fieldset class="settings-section spell-section">
					<legend>Spells</legend>
				</fieldset>`
		}
		
		this.addTab('SETTINGS', 'settings-tab', `
			<div class="settings-inputs">
				<div class="settings-section-container">
					<fieldset class="settings-section encounter-section within-raid-sim-hide">
						<legend>Encounter</legend>
					</fieldset>
					<fieldset class="settings-section race-section">
						<legend>Player</legend>
					</fieldset>
			`
			+
			spellSection
			+
			`
					<fieldset class="settings-section rotation-section">
						<legend>Rotation</legend>
					</fieldset>
				</div>
				<div class="settings-section-container custom-sections-container">
				</div>
				<div class="settings-section-container">
					<fieldset class="settings-section self-buffs-section">
						<legend>Self Buffs</legend>
					</fieldset>
					<fieldset class="settings-section imbues-section">
					<legend>Imbues</legend>
						<div class="consumes-imbue-mh"></div>
						<div class="consumes-imbue-oh"></div>
					</fieldset>
			`
			+
			petsSelectionSection
			+
			`
				</div>
				<div class="settings-section-container labeled-icon-section within-raid-sim-hide">
					<fieldset class="settings-section buffs-section">
						<legend>Raid Buffs</legend>
					</fieldset>
					<fieldset class="settings-section debuffs-section">
						<legend>Debuffs</legend>
					</fieldset>
				</div>
				<div class="settings-section-container">
					<fieldset class="settings-section new-consumes-section">
						<legend>Consumes</legend>
						<div class="consumes-row">
							<span>Potions</span>
							<div class="consumes-row-inputs">
								<div class="consumes-potions"></div>
								<div class="consumes-conjured"></div>
							</div>
						</div>
						<div class="consumes-row">
							<span>Elixirs</span>
							<div class="consumes-row-inputs">
								<div class="consumes-flasks"></div>
								<span>OR</span>
								<div class="consumes-battle-elixirs"></div>
								<div class="consumes-guardian-elixirs"></div>
							</div>
						</div>
						<div class="consumes-row">
							<span>Food</span>
							<div class="consumes-row-inputs">
								<div class="consumes-food"></div>
								<div class="consumes-alcohol"></div>
							</div>
						</div>
						<div class="consumes-row">
							<span>Trade</span>
							<div class="consumes-row-inputs consumes-trade">
							</div>
						</div>
						<div class="consumes-row consumes-row-pet">
							<span>Pet</span>
							<div class="consumes-row-inputs consumes-pet">
							</div>
						</div>
						<div class="consumes-row">
							<div class="consumes-row-inputs consumes-other">
							</div>
						</div>
					</fieldset>
				</div>
				<div class="settings-section-container cooldowns-section-container">
					<fieldset class="settings-section cooldowns-section">
						<legend>Cooldowns</legend>
						<div class="cooldowns-section-content">
						</div>
					</fieldset>
<<<<<<< HEAD
				</div>
				<div class="settings-section-container labeled-icon-section within-raid-sim-hide">
					<fieldset class="settings-section debuffs-section">
						<legend>Debuffs</legend>
					</fieldset>
				</div>
				<div class="settings-section-container">
=======
>>>>>>> bbfeb8c4ae5bfc08c7406a4edb21d0d36971cc67
					<fieldset class="settings-section other-settings-section">
						<legend>Other</legend>
					</fieldset>
				</div>
			</div>
			<div class="settings-bottom-bar">
				<div class="saved-encounter-manager within-raid-sim-hide">
				</div>
				<div class="saved-settings-manager within-raid-sim-hide">
				</div>
			</div>
		`);

		const settingsTab = this.rootElem.getElementsByClassName('settings-inputs')[0] as HTMLElement;

		const configureIconSection = (sectionElem: HTMLElement, iconPickers: Array<any>, tooltip?: string) => {
			if (tooltip) {
				tippy(sectionElem, {
					'content': tooltip,
					'allowHTML': true,
				});
			}

			if (iconPickers.length == 0) {
				sectionElem.style.display = 'none';
			}
		};

		const selfBuffsSection = this.rootElem.getElementsByClassName('self-buffs-section')[0] as HTMLElement;
		configureIconSection(
			selfBuffsSection,
			this.individualConfig.selfBuffInputs.map(iconInput => new IndividualSimIconPicker(selfBuffsSection, this.player, iconInput, this)),
			Tooltips.SELF_BUFFS_SECTION);

		if (this.individualConfig.petInputs?.length) {
			const petsSection = this.rootElem.getElementsByClassName('pets-section')[0] as HTMLElement;
			configureIconSection(
				petsSection,
				this.individualConfig.petInputs.map(iconInput => new IndividualSimIconPicker(petsSection, this.player, iconInput, this)),
				Tooltips.PETS_SECTION);
		}

		const buffOptions = this.splitRelevantOptions([
			{ item: IconInputs.AllStatsBuff, stats: [] },
			{ item: IconInputs.AllStatsPercentBuff, stats: [] },
			{ item: IconInputs.HealthBuff, stats: [Stat.StatHealth] },
			{ item: IconInputs.ArmorBuff, stats: [Stat.StatArmor] },
			{ item: IconInputs.StaminaBuff, stats: [Stat.StatStamina] },
			{ item: IconInputs.StrengthAndAgilityBuff, stats: [Stat.StatStrength, Stat.StatAgility] },
			{ item: IconInputs.IntellectBuff, stats: [Stat.StatIntellect] },
			{ item: IconInputs.SpiritBuff, stats: [Stat.StatSpirit] },
			{ item: IconInputs.AttackPowerBuff, stats: [Stat.StatAttackPower] },
			{ item: IconInputs.AttackPowerPercentBuff, stats: [Stat.StatAttackPower] },
			{ item: IconInputs.MeleeCritBuff, stats: [Stat.StatMeleeCrit] },
			{ item: IconInputs.MeleeHasteBuff, stats: [Stat.StatMeleeHaste] },
			{ item: IconInputs.SpellPowerBuff, stats: [Stat.StatSpellPower] },
			{ item: IconInputs.SpellCritBuff, stats: [Stat.StatSpellCrit] },
			{ item: IconInputs.SpellHasteBuff, stats: [Stat.StatSpellHaste] },
			{ item: IconInputs.HastePercentBuff, stats: [Stat.StatMeleeHaste, Stat.StatSpellHaste] },
			{ item: IconInputs.DamagePercentBuff, stats: [Stat.StatAttackPower, Stat.StatSpellPower] },
			{ item: IconInputs.DamageReductionPercentBuff, stats: [Stat.StatStamina] },
			{ item: IconInputs.MP5Buff, stats: [Stat.StatMP5] },
			//{ item: IconInputs.ReplenishmentBuff, stats: [Stat.StatMP5] },
		]);
		const buffsSection = this.rootElem.getElementsByClassName('buffs-section')[0] as HTMLElement;
		configureIconSection(
			buffsSection,
			buffOptions.map(multiIconInput => new MultiIconPicker(buffsSection, this.player, multiIconInput, this)),
			Tooltips.OTHER_BUFFS_SECTION);

		const otherBuffOptions = this.splitRelevantOptions([
			{ item: IconInputs.Bloodlust, stats: [Stat.StatMeleeHaste, Stat.StatSpellHaste] },
		] as Array<StatOption<IndividualSimIconPickerConfig<Player<any>, any>>>);
		otherBuffOptions.forEach(iconInput => new IndividualSimIconPicker(buffsSection, this.player, iconInput, this));

		const miscBuffOptions = this.splitRelevantOptions([
			{ item: IconInputs.HeroicPresence, stats: [Stat.StatMeleeHit, Stat.StatSpellHit] },
			{ item: IconInputs.BraidedEterniumChain, stats: [Stat.StatMeleeCrit] },
			{ item: IconInputs.ChainOfTheTwilightOwl, stats: [Stat.StatSpellCrit] },
			{ item: IconInputs.EyeOfTheNight, stats: [Stat.StatSpellPower] },
			{ item: IconInputs.Thorns, stats: [Stat.StatArmor] },
			{ item: IconInputs.RetributionAura, stats: [Stat.StatArmor] },
			{ item: IconInputs.ShadowProtection, stats: [Stat.StatStamina] },
			{ item: IconInputs.ManaTideTotem, stats: [Stat.StatMP5] },
			{ item: IconInputs.Innervate, stats: [Stat.StatMP5] },
			{ item: IconInputs.PowerInfusion, stats: [Stat.StatMP5, Stat.StatSpellPower] },
		] as Array<StatOption<IconPickerConfig<Player<any>, any>>>);
		if (miscBuffOptions.length > 0) {
			new MultiIconPicker(buffsSection, this.player, {
				inputs: miscBuffOptions,
				numColumns: 3,
				emptyColor: 'grey',
				label: 'Misc',
			}, this);
		}

		const debuffOptions = this.splitRelevantOptions([
			{ item: IconInputs.MajorArmorDebuff, stats: [Stat.StatArmorPenetration] },
			{ item: IconInputs.MinorArmorDebuff, stats: [Stat.StatArmorPenetration] },
			{ item: IconInputs.PhysicalDamageDebuff, stats: [Stat.StatAttackPower] },
			{ item: IconInputs.BleedDebuff, stats: [Stat.StatAttackPower] },
			{ item: IconInputs.SpellDamageDebuff, stats: [Stat.StatSpellPower] },
			{ item: IconInputs.SpellHitDebuff, stats: [Stat.StatSpellHit] },
			{ item: IconInputs.SpellCritDebuff, stats: [Stat.StatSpellCrit] },
			{ item: IconInputs.CritDebuff, stats: [Stat.StatMeleeCrit, Stat.StatSpellCrit] },
			{ item: IconInputs.AttackPowerDebuff, stats: [Stat.StatArmor] },
			{ item: IconInputs.MeleeAttackSpeedDebuff, stats: [Stat.StatArmor] },
			{ item: IconInputs.MeleeHitDebuff, stats: [Stat.StatDodge] },
		]);
		const debuffsSection = this.rootElem.getElementsByClassName('debuffs-section')[0] as HTMLElement;
		configureIconSection(
			debuffsSection,
			debuffOptions.map(multiIconInput => new MultiIconPicker(debuffsSection, this.player, multiIconInput, this)),
			Tooltips.DEBUFFS_SECTION);

		const otherDebuffOptions = this.splitRelevantOptions([
			{ item: IconInputs.JudgementOfWisdom, stats: [Stat.StatMP5, Stat.StatIntellect] },
			{ item: IconInputs.JudgementOfLight, stats: [Stat.StatStamina] },
			{ item: IconInputs.GiftOfArthas, stats: [Stat.StatStamina] },
		]);
		otherDebuffOptions.forEach(iconInput => new IndividualSimIconPicker(debuffsSection, this.player, iconInput, this));

		const potionOptions = this.splitRelevantOptions([
			{ item: Potions.RunicHealingPotion, stats: [Stat.StatStamina] },
			{ item: Potions.RunicManaPotion, stats: [Stat.StatIntellect] },
			{ item: Potions.IndestructiblePotion, stats: [Stat.StatArmor] },
			{ item: Potions.PotionOfSpeed, stats: [Stat.StatMeleeHaste, Stat.StatSpellHaste] },
			{ item: Potions.PotionOfWildMagic, stats: [Stat.StatMeleeCrit, Stat.StatSpellCrit, Stat.StatSpellPower] },
		]);
		if (potionOptions.length) {
			const elem = this.rootElem.getElementsByClassName('consumes-potions')[0] as HTMLElement;
			new IconEnumPicker(elem, this.player, IconInputs.makePotionsInput(potionOptions));
		}

		const conjuredOptions = this.splitRelevantOptions([
			{ item: Conjured.ConjuredHealthstone, stats: [Stat.StatStamina] },
			{ item: Conjured.ConjuredDarkRune, stats: [Stat.StatIntellect] },
			{ item: Conjured.ConjuredFlameCap, stats: [Stat.StatStrength, Stat.StatAgility, Stat.StatFireSpellPower] },
		]);
		if (conjuredOptions.length) {
			const elem = this.rootElem.getElementsByClassName('consumes-conjured')[0] as HTMLElement;
			new IconEnumPicker(elem, this.player, IconInputs.makeConjuredInput(conjuredOptions));
		}

		const flaskOptions = this.splitRelevantOptions([
			{ item: Flask.FlaskOfTheFrostWyrm, stats: [Stat.StatSpellPower] },
			{ item: Flask.FlaskOfEndlessRage, stats: [Stat.StatAttackPower, Stat.StatRangedAttackPower] },
			{ item: Flask.FlaskOfPureMojo, stats: [Stat.StatMP5] },
			{ item: Flask.FlaskOfStoneblood, stats: [Stat.StatStamina] },
			{ item: Flask.LesserFlaskOfToughness, stats: [Stat.StatResilience] },
			{ item: Flask.LesserFlaskOfResistance, stats: [Stat.StatArcaneResistance, Stat.StatFireResistance, Stat.StatFrostResistance, Stat.StatNatureResistance, Stat.StatShadowResistance] },
		]);
		if (flaskOptions.length) {
			const elem = this.rootElem.getElementsByClassName('consumes-flasks')[0] as HTMLElement;
			new IconEnumPicker(elem, this.player, IconInputs.makeFlasksInput(flaskOptions));
		}

		const battleElixirOptions = this.splitRelevantOptions([
			{ item: BattleElixir.ElixirOfAccuracy, stats: [Stat.StatMeleeHit, Stat.StatSpellHit] },
			{ item: BattleElixir.ElixirOfArmorPiercing, stats: [Stat.StatArmorPenetration] },
			{ item: BattleElixir.ElixirOfDeadlyStrikes, stats: [Stat.StatMeleeCrit, Stat.StatSpellCrit] },
			{ item: BattleElixir.ElixirOfExpertise, stats: [Stat.StatExpertise] },
			{ item: BattleElixir.ElixirOfLightningSpeed, stats: [Stat.StatMeleeHaste, Stat.StatSpellHaste] },
			{ item: BattleElixir.ElixirOfMightyAgility, stats: [Stat.StatAgility] },
			{ item: BattleElixir.ElixirOfMightyStrength, stats: [Stat.StatStrength] },
			{ item: BattleElixir.GurusElixir, stats: [Stat.StatStamina, Stat.StatAgility, Stat.StatStrength, Stat.StatSpirit, Stat.StatIntellect] },
			{ item: BattleElixir.SpellpowerElixir, stats: [Stat.StatSpellPower] },
			{ item: BattleElixir.WrathElixir, stats: [Stat.StatAttackPower, Stat.StatRangedAttackPower] },
		]);
		if (battleElixirOptions.length) {
			const elem = this.rootElem.getElementsByClassName('consumes-battle-elixirs')[0] as HTMLElement;
			new IconEnumPicker(elem, this.player, IconInputs.makeBattleElixirsInput(battleElixirOptions));
		}

		const guardianElixirOptions = this.splitRelevantOptions([
			{ item: GuardianElixir.ElixirOfMightyDefense, stats: [Stat.StatDefense] },
			{ item: GuardianElixir.ElixirOfMightyFortitude, stats: [Stat.StatStamina] },
			{ item: GuardianElixir.ElixirOfMightyMageblood, stats: [Stat.StatMP5] },
			{ item: GuardianElixir.ElixirOfMightyThoughts, stats: [Stat.StatIntellect] },
			{ item: GuardianElixir.ElixirOfProtection, stats: [Stat.StatArmor] },
			{ item: GuardianElixir.ElixirOfSpirit, stats: [Stat.StatSpirit] },
			{ item: GuardianElixir.GiftOfArthas, stats: [Stat.StatStamina] },
		]);
		if (guardianElixirOptions.length) {
			const elem = this.rootElem.getElementsByClassName('consumes-guardian-elixirs')[0] as HTMLElement;
			new IconEnumPicker(elem, this.player, IconInputs.makeGuardianElixirsInput(guardianElixirOptions));
		}

		const foodOptions = this.splitRelevantOptions([
			{ item: Food.FoodFishFeast, stats: [Stat.StatStamina, Stat.StatAttackPower, Stat.StatSpellPower] },
			{ item: Food.FoodGreatFeast, stats: [Stat.StatStamina, Stat.StatAttackPower, Stat.StatSpellPower] },
			{ item: Food.FoodBlackenedDragonfin, stats: [Stat.StatAgility] },
			{ item: Food.FoodDragonfinFilet, stats: [Stat.StatStrength] },
			{ item: Food.FoodCuttlesteak, stats: [Stat.StatSpirit] },
			{ item: Food.FoodMegaMammothMeal, stats: [Stat.StatAttackPower] },
			{ item: Food.FoodHeartyRhino, stats: [Stat.StatArmorPenetration] },
			{ item: Food.FoodRhinoliciousWormsteak, stats: [Stat.StatExpertise] },
			{ item: Food.FoodFirecrackerSalmon, stats: [Stat.StatSpellPower] },
			{ item: Food.FoodSnapperExtreme, stats: [Stat.StatMeleeHit, Stat.StatSpellHit] },
			{ item: Food.FoodSpicedWormBurger, stats: [Stat.StatMeleeCrit, Stat.StatSpellCrit] },
			{ item: Food.FoodImperialMantaSteak, stats: [Stat.StatMeleeHaste, Stat.StatSpellHaste] },
			{ item: Food.FoodMightyRhinoDogs, stats: [Stat.StatMP5] },
		]);
		if (foodOptions.length) {
			const elem = this.rootElem.getElementsByClassName('consumes-food')[0] as HTMLElement;
			new IconEnumPicker(elem, this.player, IconInputs.makeFoodInput(foodOptions));
		}

		if (this.individualConfig.weaponImbueInputs?.length) {
			const mhImbueSection = this.rootElem.getElementsByClassName('consumes-imbue-mh')[0] as HTMLElement;
			configureIconSection(
				mhImbueSection,
				this.individualConfig.weaponImbueInputs.map(iconInput => new IndividualSimIconPicker(mhImbueSection, this.player, iconInput, this)),
				);
			const ohImbueSection = this.rootElem.getElementsByClassName('consumes-imbue-oh')[0] as HTMLElement;
			if (isDualWieldSpec(this.player.spec)) {
				configureIconSection(
					ohImbueSection,
					this.individualConfig.weaponImbueInputs.map(iconInput => new IndividualSimIconPicker(ohImbueSection, this.player, iconInput, this)),
					);
			}
		}

		const tradeConsumesElem = this.rootElem.getElementsByClassName('consumes-trade')[0] as HTMLElement;
		new IndividualSimIconPicker(tradeConsumesElem, this.player, IconInputs.SuperSapper, this);
		new IndividualSimIconPicker(tradeConsumesElem, this.player, IconInputs.GoblinSapper, this);
		new IndividualSimIconPicker(tradeConsumesElem, this.player, IconInputs.FillerExplosiveInput, this);

		//if (this.individualConfig.consumeOptions?.pet?.length) {
		//	const petConsumesElem = this.rootElem.getElementsByClassName('consumes-pet')[0] as HTMLElement;
		//	this.individualConfig.consumeOptions.pet.map(iconInput => new IndividualSimIconPicker(petConsumesElem, this.player, iconInput, this));
		//} else {
		//	const petRowElem = this.rootElem.getElementsByClassName('consumes-row-pet')[0] as HTMLElement;
		//	petRowElem.style.display = 'none';
		//}

		//if (this.individualConfig.consumeOptions?.other?.length) {
		//	const containerElem = this.rootElem.getElementsByClassName('consumes-other')[0] as HTMLElement;
		//	this.individualConfig.consumeOptions.other.map(iconInput => new IndividualSimIconPicker(containerElem, this.player, iconInput, this));
		//}

		const configureInputSection = (sectionElem: HTMLElement, sectionConfig: InputSection) => {
			if (sectionConfig.tooltip) {
				tippy(sectionElem, {
					'content': sectionConfig.tooltip,
					'allowHTML': true,
				});
			}

			sectionConfig.inputs.forEach(inputConfig => {
				if (inputConfig.type == 'number') {
					new NumberPicker(sectionElem, inputConfig.getModObject(this), inputConfig.config);
				} else if (inputConfig.type == 'boolean') {
					new BooleanPicker(sectionElem, inputConfig.getModObject(this), inputConfig.config);
				} else if (inputConfig.type == 'enum') {
					new EnumPicker(sectionElem, inputConfig.getModObject(this), inputConfig.config);
				} else if (inputConfig.type == 'iconEnum') {
					new IconEnumPicker(sectionElem, inputConfig.getModObject(this), inputConfig.config);
				}
			});
		};

		if (this.individualConfig.spellInputs?.length) {
			const spellSection = this.rootElem.getElementsByClassName('spell-section')[0] as HTMLElement;
			configureIconSection(
				spellSection,
				this.individualConfig.spellInputs.map(iconInput => new IndividualSimIconPicker(spellSection, this.player, iconInput, this)),
				Tooltips.SPELLS_SECTION);
		}


		configureInputSection(this.rootElem.getElementsByClassName('rotation-section')[0] as HTMLElement, this.individualConfig.rotationInputs);

		if (this.individualConfig.otherInputs?.inputs.length) {
			configureInputSection(this.rootElem.getElementsByClassName('other-settings-section')[0] as HTMLElement, this.individualConfig.otherInputs);
		}

		const races = specToEligibleRaces[this.player.spec];
		const racePicker = new EnumPicker(this.rootElem.getElementsByClassName('race-section')[0] as HTMLElement, this.player, {
			label: 'Race',
			values: races.map(race => {
				return {
					name: raceNames[race],
					value: race,
				};
			}),
			changedEvent: sim => sim.raceChangeEmitter,
			getValue: sim => sim.getRace(),
			setValue: (eventID, sim, newValue) => sim.setRace(eventID, newValue),
		});
		const professions = getEnumValues(Profession) as Array<Profession>;
		const profession1Picker = new EnumPicker(this.rootElem.getElementsByClassName('race-section')[0] as HTMLElement, this.player, {
			label: 'Profession 1',
			values: professions.map(p => {
				return {
					name: professionNames[p],
					value: p,
				};
			}),
			changedEvent: sim => sim.professionChangeEmitter,
			getValue: sim => sim.getProfession1(),
			setValue: (eventID, sim, newValue) => sim.setProfession1(eventID, newValue),
		});
		const profession2Picker = new EnumPicker(this.rootElem.getElementsByClassName('race-section')[0] as HTMLElement, this.player, {
			label: 'Profession 2',
			values: professions.map(p => {
				return {
					name: professionNames[p],
					value: p,
				};
			}),
			changedEvent: sim => sim.professionChangeEmitter,
			getValue: sim => sim.getProfession2(),
			setValue: (eventID, sim, newValue) => sim.setProfession2(eventID, newValue),
		});
		const shattFactionPicker = new EnumPicker(this.rootElem.getElementsByClassName('race-section')[0] as HTMLElement, this.player, {
			label: 'Shatt Faction',
			values: [ShattrathFaction.ShattrathFactionAldor, ShattrathFaction.ShattrathFactionScryer].map(faction => {
				return {
					name: shattFactionNames[faction],
					value: faction,
				};
			}),
			changedEvent: sim => sim.gearChangeEmitter,
			getValue: sim => sim.getShattFaction(),
			setValue: (eventID, sim, newValue) => sim.setShattFaction(eventID, newValue),
			showWhen: (player: Player<any>) => this.player.getEquippedItem(ItemSlot.ItemSlotNeck)?.item.id == 34678 || this.player.getEquippedItem(ItemSlot.ItemSlotNeck)?.item.id == 34679,
		});

		const encounterSectionElem = settingsTab.getElementsByClassName('encounter-section')[0] as HTMLElement;
		new EncounterPicker(encounterSectionElem, this.sim.encounter, this.individualConfig.encounterPicker, this);
		const savedEncounterManager = new SavedDataManager<Encounter, SavedEncounter>(this.rootElem.getElementsByClassName('saved-encounter-manager')[0] as HTMLElement, this.sim.encounter, {
			label: 'Encounter',
			storageKey: this.getSavedEncounterStorageKey(),
			getData: (encounter: Encounter) => SavedEncounter.create({ encounter: encounter.toProto() }),
			setData: (eventID: EventID, encounter: Encounter, newEncounter: SavedEncounter) => encounter.fromProto(eventID, newEncounter.encounter!),
			changeEmitters: [this.sim.encounter.changeEmitter],
			equals: (a: SavedEncounter, b: SavedEncounter) => SavedEncounter.equals(a, b),
			toJson: (a: SavedEncounter) => SavedEncounter.toJson(a),
			fromJson: (obj: any) => SavedEncounter.fromJson(obj),
		});

		const cooldownSectionElem = settingsTab.getElementsByClassName('cooldowns-section')[0] as HTMLElement;
		const cooldownContentElem = settingsTab.getElementsByClassName('cooldowns-section-content')[0] as HTMLElement;
		new CooldownsPicker(cooldownContentElem, this.player);
		tippy(cooldownSectionElem, {
			content: Tooltips.COOLDOWNS_SECTION,
			allowHTML: true,
			placement: 'left',
		});

		// Init Muuri layout only when settings tab is clicked, because it needs the elements
		// to be shown so it can calculate sizes.
		(this.rootElem.getElementsByClassName('settings-tab-tab')[0] as HTMLElement)!.addEventListener('click', event => {
			if (this.settingsMuuri == null) {
				setTimeout(() => {
					this.settingsMuuri = new Muuri('.settings-inputs');
				}, 200); // Magic amount of time before Muuri init seems to work
			}

			setTimeout(() => {
				this.recomputeSettingsLayout();
			}, 200);
		});

		const savedSettingsManager = new SavedDataManager<IndividualSimUI<any>, SavedSettings>(this.rootElem.getElementsByClassName('saved-settings-manager')[0] as HTMLElement, this, {
			label: 'Settings',
			storageKey: this.getSavedSettingsStorageKey(),
			getData: (simUI: IndividualSimUI<any>) => {
				return SavedSettings.create({
					raidBuffs: simUI.sim.raid.getBuffs(),
					partyBuffs: simUI.player.getParty()?.getBuffs() || PartyBuffs.create(),
					playerBuffs: simUI.player.getBuffs(),
					debuffs: simUI.sim.raid.getDebuffs(),
					consumes: simUI.player.getConsumes(),
					race: simUI.player.getRace(),
					cooldowns: simUI.player.getCooldowns(),
				});
			},
			setData: (eventID: EventID, simUI: IndividualSimUI<any>, newSettings: SavedSettings) => {
				TypedEvent.freezeAllAndDo(() => {
					simUI.sim.raid.setBuffs(eventID, newSettings.raidBuffs || RaidBuffs.create());
					simUI.sim.raid.setDebuffs(eventID, newSettings.debuffs || Debuffs.create());
					const party = simUI.player.getParty();
					if (party) {
						party.setBuffs(eventID, newSettings.partyBuffs || PartyBuffs.create());
					}
					simUI.player.setBuffs(eventID, newSettings.playerBuffs || IndividualBuffs.create());
					simUI.player.setConsumes(eventID, newSettings.consumes || Consumes.create());
					simUI.player.setRace(eventID, newSettings.race);
					simUI.player.setCooldowns(eventID, newSettings.cooldowns || Cooldowns.create());
				});
			},
			changeEmitters: [
				this.sim.raid.buffsChangeEmitter,
				this.sim.raid.debuffsChangeEmitter,
				this.player.getParty()!.buffsChangeEmitter,
				this.player.buffsChangeEmitter,
				this.player.consumesChangeEmitter,
				this.player.raceChangeEmitter,
				this.player.cooldownsChangeEmitter,
			],
			equals: (a: SavedSettings, b: SavedSettings) => SavedSettings.equals(a, b),
			toJson: (a: SavedSettings) => SavedSettings.toJson(a),
			fromJson: (obj: any) => SavedSettings.fromJson(obj),
		});

		const customSectionsContainer = this.rootElem.getElementsByClassName('custom-sections-container')[0] as HTMLElement;
		let anyCustomSections = false;
		for (const [sectionName, sectionConfig] of Object.entries(this.individualConfig.additionalSections || {})) {
			const sectionCssPrefix = sectionName.replace(/\s+/g, '');
			const sectionElem = document.createElement('fieldset');
			sectionElem.classList.add('settings-section', sectionCssPrefix + '-section');
			sectionElem.innerHTML = `<legend>${sectionName}</legend>`;
			customSectionsContainer.appendChild(sectionElem);
			configureInputSection(sectionElem, sectionConfig);
			anyCustomSections = true;
		};

		for (const [sectionName, sectionConfig] of Object.entries(this.individualConfig.additionalIconSections || {})) {
			const sectionCssPrefix = sectionName.replace(/\s+/g, '');
			const sectionElem = document.createElement('fieldset');
			sectionElem.classList.add('settings-section', sectionCssPrefix + '-section');
			sectionElem.innerHTML = `<legend>${sectionName}</legend>`;
			customSectionsContainer.appendChild(sectionElem);
			configureIconSection(sectionElem, sectionConfig.map(iconInput => new IndividualSimIconPicker(sectionElem, this.player, iconInput, this)));
			anyCustomSections = true;
		};

		(this.individualConfig.customSections || []).forEach(customSection => {
			const sectionElem = document.createElement('fieldset');
			customSectionsContainer.appendChild(sectionElem);
			const sectionName = customSection(this, sectionElem);
			const sectionCssPrefix = sectionName.replace(/\s+/g, '');
			sectionElem.classList.add('settings-section', sectionCssPrefix + '-section');
			const labelElem = document.createElement('legend');
			labelElem.textContent = sectionName;
			sectionElem.prepend(labelElem);
			anyCustomSections = true;
		});

		if (!anyCustomSections) {
			customSectionsContainer.remove();
		}

		this.sim.waitForInit().then(() => {
			savedEncounterManager.loadUserData();
			savedSettingsManager.loadUserData();
		});

		Array.from(this.rootElem.getElementsByClassName('settings-section-container')).forEach((container, i) => {
			(container as HTMLElement).style.zIndex = String(1000 - i);
		});
	}

	private addTalentsTab() {
		this.addTab('TALENTS', 'talents-tab', `
			<div class="player-pet-toggle">
			</div>
			<div class="talents-content">
				<div class="talents-tab-content">
					<div class="talents-picker">
					</div>
					<div class="glyphs-picker">
					</div>
				</div>
				<div class="saved-talents-manager">
				</div>
			</div>
			<div class="talents-content">
				<div class="talents-tab-content">
					<div class="pet-talents-picker">
					</div>
				</div>
			</div>
		`);

		const talentsPicker = newTalentsPicker(this.rootElem.getElementsByClassName('talents-picker')[0] as HTMLElement, this.player);
		const glyphsPicker = newGlyphsPicker(this.rootElem.getElementsByClassName('glyphs-picker')[0] as HTMLElement, this.player);

		const savedTalentsManager = new SavedDataManager<Player<any>, SavedTalents>(this.rootElem.getElementsByClassName('saved-talents-manager')[0] as HTMLElement, this.player, {
			label: 'Talents',
			storageKey: this.getSavedTalentsStorageKey(),
			getData: (player: Player<any>) => SavedTalents.create({
				talentsString: player.getTalentsString(),
				glyphs: player.getGlyphs(),
			}),
			setData: (eventID: EventID, player: Player<any>, newTalents: SavedTalents) => {
				TypedEvent.freezeAllAndDo(() => {
					player.setTalentsString(eventID, newTalents.talentsString);
					player.setGlyphs(eventID, newTalents.glyphs || Glyphs.create());
				});
			},
			changeEmitters: [this.player.talentsChangeEmitter, this.player.glyphsChangeEmitter],
			equals: (a: SavedTalents, b: SavedTalents) => SavedTalents.equals(a, b),
			toJson: (a: SavedTalents) => SavedTalents.toJson(a),
			fromJson: (obj: any) => SavedTalents.fromJson(obj),
		});

		this.sim.waitForInit().then(() => {
			savedTalentsManager.loadUserData();
			this.individualConfig.presets.talents.forEach(config => {
				config.isPreset = true;
				savedTalentsManager.addSavedData({
					name: config.name,
					isPreset: true,
					data: config.data,
				});
			});

			if (this.player.getClass() == Class.ClassHunter) {
				const petTalentsPicker = new HunterPetTalentsPicker(this.rootElem.getElementsByClassName('pet-talents-picker')[0] as HTMLElement, this.player as Player<Spec.SpecHunter>);

				let curShown = 0;
				const toggledElems = Array.from(this.rootElem.getElementsByClassName('talents-content')) as Array<HTMLElement>;
				const updateToggle = () => {
					toggledElems[1 - curShown].style.display = 'none';
					toggledElems[curShown].style.removeProperty('display');

					if (curShown == 0) {
						petTypeToggle.rootElem.style.display = 'none';
					} else {
						petTypeToggle.rootElem.style.removeProperty('display');
					}
				}

				const toggleContainer = this.rootElem.getElementsByClassName('player-pet-toggle')[0] as HTMLElement;
				const playerPetToggle = new EnumPicker(toggleContainer, this, {
					values: [
						{ name: 'Player', value: 0 },
						{ name: 'Pet', value: 1 },
					],
					changedEvent: sim => new TypedEvent(),
					getValue: sim => curShown,
					setValue: (eventID, sim, newValue) => {
						curShown = newValue;
						updateToggle();
					},
				});
				const petTypeToggle = new EnumPicker(toggleContainer, this.player as Player<Spec.SpecHunter>, makePetTypeInputConfig(false));
				updateToggle();
			}
		});
	}

	private addDetailedResultsTab() {
		this.addTab('DETAILED RESULTS', 'detailed-results-tab', `
			<div class="detailed-results">
			</div>
		`);

		const detailedResults = new DetailedResults(this.rootElem.getElementsByClassName('detailed-results')[0] as HTMLElement, this, this.raidSimResultsManager!);
	}

	private addLogTab() {
		this.addTab('LOG', 'log-tab', `
			<div class="log-runner">
			</div>
		`);

		const logRunner = new LogRunner(this.rootElem.getElementsByClassName('log-runner')[0] as HTMLElement, this);
	}

	applyDefaults(eventID: EventID) {
		TypedEvent.freezeAllAndDo(() => {
			const tankSpec = isTankSpec(this.player.spec);

			this.player.setRace(eventID, specToEligibleRaces[this.player.spec][0]);
			this.player.setGear(eventID, this.sim.lookupEquipmentSpec(this.individualConfig.defaults.gear));
			this.player.setConsumes(eventID, this.individualConfig.defaults.consumes);
			this.player.setRotation(eventID, this.individualConfig.defaults.rotation);
			this.player.setTalentsString(eventID, this.individualConfig.defaults.talents.talentsString);
			this.player.setGlyphs(eventID, this.individualConfig.defaults.talents.glyphs || Glyphs.create());
			this.player.setSpecOptions(eventID, this.individualConfig.defaults.specOptions);
			this.player.setBuffs(eventID, this.individualConfig.defaults.individualBuffs);
			this.player.getParty()!.setBuffs(eventID, this.individualConfig.defaults.partyBuffs);
			this.player.getRaid()!.setBuffs(eventID, this.individualConfig.defaults.raidBuffs);
			this.player.setEpWeights(eventID, this.individualConfig.defaults.epWeights);
			this.player.applySharedDefaults(eventID);

			if (!this.isWithinRaidSim) {
				this.sim.encounter.applyDefaults(eventID);
				this.sim.raid.setDebuffs(eventID, this.individualConfig.defaults.debuffs);
				this.sim.applyDefaults(eventID, tankSpec);

				if (tankSpec) {
					this.sim.raid.setTanks(eventID, [this.player.makeRaidTarget()]);
				} else {
					this.sim.raid.setTanks(eventID, []);
				}
			}
		});
	}

	registerExclusiveEffect(effect: ExclusiveEffect) {
		effect.tags.forEach(tag => {
			this.exclusivityMap[tag].push(effect);

			effect.changedEvent.on(eventID => {
				if (!effect.isActive())
					return;

				// TODO: Mark the parent somehow so we can track this for undo/redo.
				const newEventID = TypedEvent.nextEventID();
				TypedEvent.freezeAllAndDo(() => {
					this.exclusivityMap[tag].forEach(otherEffect => {
						if (otherEffect == effect || !otherEffect.isActive())
							return;

						otherEffect.deactivate(newEventID);
					});
				});
			});
		});
	}

	getSavedGearStorageKey(): string {
		return this.getStorageKey(SAVED_GEAR_STORAGE_KEY);
	}

	getSavedRotationStorageKey(): string {
		return this.getStorageKey(SAVED_ROTATION_STORAGE_KEY);
	}

	getSavedSettingsStorageKey(): string {
		return this.getStorageKey(SAVED_SETTINGS_STORAGE_KEY);
	}

	getSavedTalentsStorageKey(): string {
		return this.getStorageKey(SAVED_TALENTS_STORAGE_KEY);
	}

	private recomputeSettingsLayout() {
		if (this.settingsMuuri) {
			//this.settingsMuuri.refreshItems();
		}
		window.dispatchEvent(new Event('resize'));
	}

	// Returns the actual key to use for local storage, based on the given key part and the site context.
	getStorageKey(keyPart: string): string {
		// Local storage is shared by all sites under the same domain, so we need to use
		// different keys for each spec site.
		return specToLocalStorageKey[this.player.spec] + keyPart;
	}

	toProto(): IndividualSimSettings {
		return IndividualSimSettings.create({
			settings: this.sim.toProto(),
			player: this.player.toProto(true),
			raidBuffs: this.sim.raid.getBuffs(),
			debuffs: this.sim.raid.getDebuffs(),
			tanks: this.sim.raid.getTanks(),
			partyBuffs: this.player.getParty()?.getBuffs() || PartyBuffs.create(),
			encounter: this.sim.encounter.toProto(),
			epWeights: this.player.getEpWeights().asArray(),
		});
	}

	fromProto(eventID: EventID, settings: IndividualSimSettings) {
		TypedEvent.freezeAllAndDo(() => {
			if (!settings.player) {
				return;
			}
			if (settings.settings) {
				this.sim.fromProto(eventID, settings.settings);
			}
			this.player.fromProto(eventID, settings.player);
			if (settings.epWeights?.length > 0) {
				this.player.setEpWeights(eventID, new Stats(settings.epWeights));
			} else {
				this.player.setEpWeights(eventID, this.individualConfig.defaults.epWeights);
			}
			this.sim.raid.setBuffs(eventID, settings.raidBuffs || RaidBuffs.create());
			this.sim.raid.setDebuffs(eventID, settings.debuffs || Debuffs.create());
			this.sim.raid.setTanks(eventID, settings.tanks || []);
			const party = this.player.getParty();
			if (party) {
				party.setBuffs(eventID, settings.partyBuffs || PartyBuffs.create());
			}

			this.sim.encounter.fromProto(eventID, settings.encounter || EncounterProto.create());
		});
	}

	splitRelevantOptions<T>(options: Array<StatOption<T>>): Array<T> {
		return options
				.filter(option => option.stats.length == 0 || option.stats.some(stat => this.individualConfig.epStats.includes(stat)))
				.map(option => option.item);
	}
}

export type ExclusivityTag =
	'Battle Elixir'
	| 'Drums'
	| 'Food'
	| 'Pet Food'
	| 'Guardian Elixir'
	| 'Potion'
	| 'Conjured'
	| 'Spirit'
	| 'MH Weapon Imbue'
	| 'OH Weapon Imbue';

export interface ExclusiveEffect {
	tags: Array<ExclusivityTag>;
	changedEvent: TypedEvent<any>;
	isActive: () => boolean;
	deactivate: (eventID: EventID) => void;
}

export interface StatOption<T> {
	stats: Array<Stat>,
	item: T,
}
