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
            if (thrown.toString() === 'Cancel') {
                resData = 'cancel';
            } else {
                resData = {error: (thrown && thrown.response && thrown.response.data && thrown.response.data.message) || 'An error has occurred'};;
            }
        });
        return resData || response.data;
    }

    /*  My Profile Page Services  */
    async getUserInformation() {
        // return user
        return await ApiService.getData(`/SelfService/webapi/authapi/userInformation`);
    }

    /*  Security Question Page Services  */
    async getChallengeQuestions() {
        /*return {
            "challengeQuestions": [
                "What is the city of your birth?",
                "What was your childhood nickname?",
                "What is the name of your pet?"
            ]
        };*/
        return await ApiService.getData(`/SelfService/webapi/unauthapi/allChallengeQuestions`);
    }

    async updateQuestion(name, payload) {
        return await ApiService.putMethod(`/SelfService/webapi/authapi/users/${name}/challengeQuestions`, payload);
    }

    /*  Change Password Page Services  */
    async updatePassword(name, payload) {
        return await ApiService.putMethod(`/SelfService/webapi/authapi/users/${name}/password`, payload);
    }
}
