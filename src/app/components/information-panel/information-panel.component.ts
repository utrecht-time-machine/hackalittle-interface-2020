import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserInterfaceService} from "../../services/user-interface.service";

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss']

})
export class InformationPanelComponent implements OnInit {
  beginkaartExpanded = false;
  beginkaartCollapsedHeight = 100; //px

  constructor(public ui: UserInterfaceService) { }

  ngOnInit() {}

  @ViewChild('beginkaart') beginkaartElRef: ElementRef;


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
