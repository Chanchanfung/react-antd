import axios from "axios";

export const getCurrentCity= () => {
    const localcity = JSON.parse(localStorage.getItem('zf_city'))
    if (!localcity) {
        return new Promise((resolve, reject) => {
            const curCity = new window.BMapGL.LocalCity()
            curCity.get(async ( res ) => {
                try {
                    const result = await axios.get(
                        `http://localhost:8080/area/info?name=${res.name}`
                    );
                    // 保存到本地存储中
                    localStorage.setItem("zf_city", JSON.stringify(result.data.body));
                    resolve(result.data.body);
                }catch (e) {
                    reject(e)
                }
            })
        })
    }
    return Promise.resolve(localcity);
}