import {Component, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger,} from '@angular/animations';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('showingInfoAnimation', [
            // ...
            state('informationShown', style({
                height: '100vh'
            })),
            state('informationHidden', style({
                height: '60vh'
            })),

            state('panoramaHidden', style({
                height: '0vh'
            })),
            state('panoramaShown', style({
                height: '40vh'
            })),

            transition('informationShown => informationHidden', [
                animate('0.25s')
            ]),
            transition('informationHidden => informationShown', [
                animate('0.25s')
            ]),
            transition('panoramaShown => panoramaHidden', [
                animate('0.25s')
            ]),
            transition('panoramaHidden => panoramaShown', [
                animate('0.25s')
            ]),
        ]),
        // trigger('beginkaartExpansionAnimation', [
        //     state('beginkaartInfoExpanded', style({
        //         height: '100%'
        //     })),
        //     state('beginkaartInfoCollapsed', style({
        //         height: '150px'
        //     })),
        //     transition('beginkaartInfoExpanded => beginkaartInfoCollapsed', [
        //         animate('0.25s')
        //     ]),
        //     transition('beginkaartInfoCollapsed => beginkaartInfoExpanded', [
        //         animate('0.25s')
        //     ]),
        // ])
    ]
})
export class HomePage {
    moreInfoShown = false;
    beginkaartExpanded = false;

    constructor() {
    }

    onShowMoreInfo() {
        this.moreInfoShown = !this.moreInfoShown;
    }

    onToggleBeginkaart() {
        this.beginkaartExpanded = !this.beginkaartExpanded;
    }
}
