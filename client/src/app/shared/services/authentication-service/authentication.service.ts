import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthenticationService {
	public token: string;

	private handleError(error: any) {
		console.error('Was error', error);
		return Observable.throw(error.message || error);
	}

	constructor(private http: Http) {
		// set token if saved in local storage
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = currentUser && currentUser.token;
	}

	login(username: string, password: string): Observable<boolean> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.http
			.post(
				'/auth/login',
				JSON.stringify({ username: username, password: password }),
				options
			)
			.map((response: Response) => {
				// login successful if there's a jwt token in the response
				let token = response.json() && response.json().token;
				if (token) {
					// set token property
					this.token = token;

					// store username and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem(
						'currentUser',
						JSON.stringify({ username: username, token: token })
					);

					// return true to indicate successful login
					return true;
				} else {
					// return false to indicate failed login
					return false;
				}
			})
			.catch(this.handleError);
	}

	logout(): void {
		// clear token remove user from local storage to log user out
		this.token = null;
		localStorage.removeItem('currentUser');
	}
}
