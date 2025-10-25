import axios from "axios";

const createApiClient = (baseURL) => {
    return axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
    });
};

export default createApiClient;