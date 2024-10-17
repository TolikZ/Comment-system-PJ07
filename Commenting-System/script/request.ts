import { AxiosStatic } from 'axios';

declare global {
  const axios: AxiosStatic;
}

interface DataType {
  name: {
    first: string;
    last: string;
  };
  login: {
    username: string;
  };
  picture: {
    medium: string;
  };
}

export interface UserType {
  name: string;
  username: string;
  avatar: string;
}

export const userRequestUrl =
  'https://randomuser.me/api/1.4/?inc=name,login,picture&nat=us,fr,ch,de&noinfo';

export const getUser = async (): Promise<UserType> => {
  return await axios
    .get(userRequestUrl)
    .then(({ data }: { data: { results: DataType[] } }) => {
      const { name, login, picture } = data.results[0];
      const { first, last } = name;

      return {
        name: `${first} ${last}`,
        username: login.username,
        avatar: picture.medium,
      };
    });
}