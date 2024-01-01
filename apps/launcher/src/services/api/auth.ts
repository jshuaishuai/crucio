
import {Auth$Login$Response} from '@app/utils/types/api';

export class AuthApi {
  login = async (): Promise<Auth$Login$Response> => {
    // faking request

    return {
      status: 'success',
      data: {
        'some-session-info?': {},
      },
    };
  };
}
