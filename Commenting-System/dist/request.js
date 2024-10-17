export const userRequestUrl = 'https://randomuser.me/api/1.4/?inc=name,login,picture&nat=us,fr,ch,de&noinfo';
export const getUser = async () => {
    return await axios
        .get(userRequestUrl)
        .then(({ data }) => {
        const { name, login, picture } = data.results[0];
        const { first, last } = name;
        return {
            name: `${first} ${last}`,
            username: login.username,
            avatar: picture.medium,
        };
    });
};
