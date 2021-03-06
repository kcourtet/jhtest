import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataAnalysis } from './data-analysis.model';
import { DataAnalysisService } from './data-analysis.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-data-analysis',
    templateUrl: './data-analysis.component.html'
})
export class DataAnalysisComponent implements OnInit, OnDestroy {
dataAnalyses: DataAnalysis[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private dataAnalysisService: DataAnalysisService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.dataAnalysisService.query().subscribe(
            (res: HttpResponse<DataAnalysis[]>) => {
                this.dataAnalyses = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDataAnalyses();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DataAnalysis) {
        return item.id;
    }
    registerChangeInDataAnalyses() {
        this.eventSubscriber = this.eventManager.subscribe('dataAnalysisListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
