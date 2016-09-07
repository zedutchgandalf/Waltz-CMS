import {Component, Input} from '@angular/core';
import {OnInit}           from '@angular/core';
import {Router}           from '@angular/router';

import {AppDataService}   from './app-data.service';

@Component({
    selector    : 'post',
    templateUrl : 'components/post'
})

export class PostComponent implements OnInit {
    @Input() post;
    info : any = {};

    constructor(private _router  : Router,
                private _appData : AppDataService) {}

    openPost() {
        if (this.info.usePostDetails) {
            this._router.navigate( ['/posts', this.post.urlString] );
        } else {
            console.debug("Post details are disabled.");
        }
    }

    ngOnInit() {
        this.info = this._appData.info;
        this._appData.infoChange.subscribe(info => this.info = info);
    }
}