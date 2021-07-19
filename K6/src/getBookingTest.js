import http from 'k6/http';
import {check, sleep} from 'k6';

let options = {
    vus: 1,
    duration: '600s',
    thresholds: {
        http_req_failed: ['rate<0.01'],   // http errors should be less than 1%
        http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    },
};

const SLEEP_DURATION = 0.1;


export default function () {
    let getTokenBody = JSON.stringify({
        username: 'admin',
        password: 'password123',
    });

    var params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

        let createBookingBody = JSON.stringify({
            firstname: "Nik",
            lastname: "tha",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        });


        let createBookingresponse = http.post(
            "https://restful-booker.herokuapp.com/booking",
            createBookingBody,
            params,
        );
        check(createBookingresponse, {
            'is status 200': (r) => r.status === 200,
            'is booking id present': (r) => r.json().hasOwnProperty('bookingid'),
            'is firstname valid': (r) => r.firstname === 'Nik',
        });
        let bookingid = createBookingresponse.json()['bookingid'];
        sleep(SLEEP_DURATION);

        let getBookingresponse = http.get(
            'https://restful-booker.herokuapp.com/booking/' + bookingid,
            params,
        );
        check(getBookingresponse, {
            'is status 200 for get after create': (r) => r.status === 200,
        });
        sleep(SLEEP_DURATION);

        let updateBookingBody = JSON.stringify({
            firstname: 'Nik' + __ITER,
            lastname: "tha",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        });
        sleep(SLEEP_DURATION);

        let token_response = http.post(
            'https://restful-booker.herokuapp.com/auth',
            getTokenBody,
            params,
        );
        check(token_response, {
            'is status 200': (r) => r.status === 200,
            'is auth token present': (r) => r.json().hasOwnProperty('token'),
            'is firstname updated': (r) => r.firstname === 'Nik' + __ITER,
        });
        sleep(SLEEP_DURATION);

        params.headers['Cookie'] = 'token=' + token_response.json()['token'];
        let updateBookingResponse = http.put(
            'https://restful-booker.herokuapp.com/booking/' + bookingid,
            updateBookingBody,
            params,
        );
        check(updateBookingResponse, {
            'is status 200 for update': (r) => r.status === 200,
        });
        sleep(SLEEP_DURATION);
        getBookingresponse = http.get(
            'https://restful-booker.herokuapp.com/booking/' + bookingid,
            params,
        );
        check(getBookingresponse, {
            'is status 200 for get after update': (r) => r.status === 200,
        });

}