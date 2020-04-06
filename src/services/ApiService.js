import Cookies from "universal-cookie"
import axios from "axios";

const apiEndPoint = window.location.protocol+'//'+window.location.host;
const axiosInstance = axios.create({
    baseURL: apiEndPoint,
});
const cookies = new Cookies();

export const getLoginUser = () => {
    return {
        "login": cookies.get('OAMUserName'),
    }
}

/*const user = {
    "userLogin": "123456",
    "firstName": "User1",
    "lastName": "Demo",
    "dob": "12/08/1995",
    "last4ofSSN": "12/22/2020",
    "email": "test@gmail.com",
    "middleName": "TestUser",
    "password": "TestPassword",
    "confirmPassword": "TestPassword",
    "challengeQuestions": [
        "What is the city of your birth?",
        "What was your childhood nickname?",
        "What is the name of your pet?"
    ]
}*/

// const userInfo = {
//     "challengeQuestions": [
//         "What is the name of your pet?",
//         "What is your mother's maiden name?",
//         "What is the city of your birth?",
//     ],
//     "email": "xelsysadm@company.com",
//     "firstName": "xelsysadm",
//     "lastName": "admin",
//     "userId": "1",
//     "userLogin": "xelsysadm"
// }

// const getChallengeQue = {
//     "challengeQuestions": [
//         "Who was your fifth grade teacher?",
//         "What street did you live on in third grade?",
//         "What is your oldest sibling's birth month and year?",
//         "What is the name of a city where you got lost?",
//         "Where were you when you had your first kiss?",
//         "In what city did you meet your spouse/significant other?",
//         "What was your childhood nickname?",
//         "What is the name of your favorite childhood friend?",
//         "What is the middle name of your oldest child?",
//         "Where were you New Year's 2000?",
//         "What is the name of your pet?",
//         "What is your mother's maiden name?",
//         "What is the city of your birth?",
//         "What highschool did you attend?",
//         "What is your oldest sibling's middle name?",
//         "What is your favorite color?"
//     ]
// }

export class ApiService {

    static async getData(url, headers, cancelToken, data) {
        const config = {
            headers: {
                ...(headers || {}),
                'Content-Type': 'application/json'
            },
        };
        if (data) {
            config.data = data;
        }
        if (cancelToken && cancelToken.token) {
            config.cancelToken = cancelToken.token;
        }
        const response = await axiosInstance.get(url, config).catch((err) => {
            data = {error: (err && err.response && err.response.data && err.response.data.message) || 'An error has occurred'};
        });
        return data || response.data;
    }

    static async putMethod(url, data, headers, cancelToken) {
        const config = {
            headers: {
                ...(headers || {})
            }
        };
        if (cancelToken && cancelToken.token) {
            config.cancelToken = cancelToken.token;
        }
        let resData = '';
        const response = await axiosInstance.put(url, data, config).catch(thrown => {
            resData = {error: 'An error has occurred.' , errorData: thrown};
        });
        return resData || response.data;
    }

    /*  My Profile Page Services  */
    async getUserInformation() {
        // return userInfo
        // return await ApiService.getData(`GetUserInfo.json`);
        return await ApiService.getData(`/SelfService/webapi/authapi/userInformation`);
    }

    /*  Security Question Page Services  */
    async getChallengeQuestions() {
        // return getChallengeQue
        // return await ApiService.getData(`GetAllChallengeQue.json`);
        return await ApiService.getData(`/SelfService/webapi/unauthapi/allChallengeQuestions`);
    }

    async updateQuestion(name, payload) {
        // return {"status":"completed","userId":"NA11111"}
        return await ApiService.putMethod(`/SelfService/webapi/authapi/users/${name}/challengeQuestions`, payload);
    }

    /*  Change Password Page Services  */
    async updatePassword(name, payload) {
        // return {"status":"completed","userId":"NA11111"}
        return await ApiService.putMethod(`/SelfService/webapi/authapi/users/${name}/password`, payload);
    }

    async getLoginUserName() {
        // return {"result":'DEEPA  GEORGE'}
        return await ApiService.getData(`v1/users/name`);
    }
}
