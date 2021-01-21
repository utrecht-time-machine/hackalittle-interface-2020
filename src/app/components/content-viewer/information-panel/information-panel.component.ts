import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UserInterfaceService } from '../../../services/user-interface.service';
import { Entity } from '../../../models/entity.model';
import { environment } from 'src/environments/environment';
import { EntityService } from '../../../services/entity.service';
import { WikidataService } from '../../../services/wikidata.service';

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit {
  env = environment;

  beginkaartExpanded = false;
  beginkaartCollapsedHeight = 100; //px
  @Input() entity: Entity;

  constructor(
    public ui: UserInterfaceService,
    public entities: EntityService,
    public wikidata: WikidataService
  ) {}

  ngOnInit() {
    this.enrichEntity();
  }

  private async enrichEntity() {
    await this.reconcileWithWikidata();
    await this.wikidata.enrichEntityUsingWikidata(
      this.entity,
      this.entity.refersToIds.wikidataID
    );
  }

  private async reconcileWithWikidata() {
    const alreadyReconciled = this.entity.refersToIds.wikidataID;
    if (alreadyReconciled) {
      return;
    }

    const rijksmonumentID = this.entity.refersToIds.rijksmonumentID;
    if (rijksmonumentID) {
      this.entity.refersToIds.wikidataID = await this.wikidata.getWikidataIdFromRijksmonumentId(
        rijksmonumentID
      );
    }
  }

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
