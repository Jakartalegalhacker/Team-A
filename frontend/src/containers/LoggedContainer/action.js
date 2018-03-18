import Amplify, { Auth } from 'aws-amplify';
import aws_exports from '../../aws-exports';
Amplify.configure(aws_exports);

export function authenticate() {
    return new Promise((resolve,reject)=>{
        
        // Auth.signOut()
        // .then(data => console.log(data))
        // .catch(err => console.log(err));
        Auth.currentSession().then((result)=>{
            console.log(result);
            resolve(true);
        }).catch((result)=>{
            reject(false);
        });
        
        
    });
}
export function signOut(){
    return new Promise((resolve,reject)=>{
        Auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
    });
}