import { Registry } from '../../../../platform/registry/common/platform.js';
import {
	Extensions as ViewContainerExtensions, IViewContainersRegistry,
	ViewContainerLocation, IViewsRegistry, Extensions as ViewExtensions,
} from '../../../common/views.js';

import * as nls from '../../../../nls.js';

import { VoidViewPane } from './voidViewPane.js';

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';

import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';


const voidThemeIcon = Codicon.search;
const voidViewIcon = registerIcon('void-view-icon', voidThemeIcon, localize('voidViewIcon', 'View icon of the Void chat view.'));


// compare against search.contribution.ts and https://app.greptile.com/chat/w1nsmt3lauwzculipycpn?repo=github%3Amain%3Amicrosoft%2Fvscode
// and debug.contribution.ts, scm.contribution.ts (source control)

// called VIEWLET_ID in other places for some reason
const VIEW_CONTAINER_ID = 'workbench.view.void'

// Register view container
const viewContainerRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
const viewContainer = viewContainerRegistry.registerViewContainer({
	id: VIEW_CONTAINER_ID,
	title: nls.localize2('void', 'Void'), // this is used to say "Void" (Ctrl + L)
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [VIEW_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	hideIfEmpty: false,
	icon: voidViewIcon,
	order: 1,
}, ViewContainerLocation.AuxiliaryBar, { doNotRegisterOpenCommand: true, });



// Register search default location to the container (sidebar)
const viewsRegistry = Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry);
viewsRegistry.registerViews([{
	id: VIEW_CONTAINER_ID, // not sure if we can change this
	hideByDefault: false, // start open
	containerIcon: voidViewIcon,
	name: nls.localize2('void chat', "Chat"), // this says ... : CHAT
	ctorDescriptor: new SyncDescriptor(VoidViewPane),
	canToggleVisibility: false,
	canMoveView: true,
	openCommandActionDescriptor: {
		id: viewContainer.id,
		keybindings: {
			primary: KeyMod.CtrlCmd | KeyCode.KeyL, // we don't need to disable the original ctrl+L (probably because it brings panel into focus first)
		},
		order: 1
		// mnemonicTitle: nls.localize({ key: 'miViewSearch', comment: ['&& denotes a mnemonic'] }, "&&Search"),
	}
}], viewContainer);


// TODO can add a configuration for the user to choose config options - see search.contribution.ts

