import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
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
        ])
    ]
})
export class HomePage {
    @ViewChild('beginkaart') beginkaartElRef: ElementRef;

    moreInfoShown = false;
    beginkaartExpanded = false;
    beginkaartCollapsedHeight = 100; //px

    constructor() {
    }

    onShowMoreInfo() {
        this.moreInfoShown = !this.moreInfoShown;
    }

    onToggleBeginkaart() {
        this.beginkaartExpanded = !this.beginkaartExpanded;

        if (!this.beginkaartExpanded) {
            this.collapseSection(this.beginkaartElRef.nativeElement);
        } else {
            this.expandSection(this.beginkaartElRef.nativeElement);
        }
    }

    collapseSection(element) {
        const sectionHeight = element.scrollHeight;

        const elementTransition = element.style.transition;
        element.style.transition = '';

        requestAnimationFrame(() => {
            element.style.height = sectionHeight + 'px';
            element.style.transition = elementTransition;

            requestAnimationFrame(() => {
                element.style.height = this.beginkaartCollapsedHeight + 'px';
                element.style.overflow = 'hidden';
            });
        });

        element.setAttribute('data-collapsed', 'true');
    }

    expandSection(element) {
        const sectionHeight = element.scrollHeight;

        element.style.height = sectionHeight + 'px';

        element.addEventListener('transitionend', function (e) {
            element.removeEventListener('transitionend', arguments.callee);

            element.style.height = null;
            element.style.overflow = 'auto';
        });

        element.setAttribute('data-collapsed', 'false');
    }
}
