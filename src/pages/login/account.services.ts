import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Link } from '../../app/link'
import { Token } from '../../app/token'
import 'rxjs'
import { Storage } from '@ionic/storage'
@Injectable()
export class AccountService {
    link: string
    token: Token
    client_id:string
    private headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" })
    jheaders: Headers
    constructor(private http: Http, private url: Link, private storage: Storage) {
        this.link = url.uri
        this.client_id=url.client_id
        this.getauth()

    }
    login(username: string, password: string): Promise<Token> {
        return this.http.post(this.link + "o/token/", 
        "username=" + username + "&password=" + password + "&grant_type=password&client_id="+this.client_id, 
        { headers: this.headers })
            .toPromise()
            .then(response => response.json() as Token)
            .catch(this.error)
    }
    public getauth() {
        this.storage.get("user").then((data) => {
            //  console.log("the token",data)
            if (data != null) {
                this.token = data
                this.jheaders = new Headers({ "Content-Type": "application/json", "Authorization": "Bearer " + data.access_token })
            }
            else
            {
              this.jheaders = new Headers({ "Content-Type": "application/json"})   
            }
        });
    }
    private error(error: any): Promise<any> {
        return Promise.reject(error.message || error)
    }
    profile(): Promise<any> {
        //this.jheaders = new Headers({ "Content-Type": "application/json", "Authorization": "Bearer " + token })
        return this.http.get(this.link + "api/teachers", { headers: this.jheaders }).toPromise()
            .then(response => response.json() as any)
            .catch(this.error)
    }

}