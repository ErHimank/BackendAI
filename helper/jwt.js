var { expressjwt }  =  require("express-jwt");

function  authJwt() {
    const secret  = process.env.secret;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms : ['HS256'],
        isRevoked : isRevoked 

    }).unless({
        path : [
            {url : /\/api\/AI\/Products(.*)/ ,  methods : ['GET' , 'OPTIONS']},
            {url : /\/api\/AI\/Categories(.*)/ ,  methods : ['GET' , 'OPTIONS']},
            {url : /\/public\/uploads(.*)/ ,  methods : ['GET' , 'OPTIONS']},
            {url: /\/api\/AI\/Jds(.*)/ , methods : ['POST','GET' , 'PUT',  'DELETE',  'OPTIONS']},
            {url: /\/api\/AI\/NewCandidates(.*)/ , methods : ['GET' , 'POST', 'PUT',  'DELETE',  'OPTIONS']},
            `${api}/Users/login` ,
            `${api}/Users/register` ,
            `${api}/Jds`,
            // `${api}/Users/verify-otp`,
            `${api}/Users`,

        ]
    })
}

async function isRevoked(req,payload ) {
    console.log(payload) 
    if(payload.isAdmin == false) {
        console.log("not admin");
        return true;
    }
     console.log('admin') 
     return false;
}

module.exports = authJwt;