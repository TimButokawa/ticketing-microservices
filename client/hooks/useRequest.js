import axios from 'axios';
import React from 'react';

const useRequest = ({
  body,
  method,
  url,
  onSuccess,
}) => {
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const doRequest = React.useCallback(async (props = {}) => {
    setLoading(true);
    setErrors([]);
    try  {
      const res = await axios[method](url, {...body, ...props });
      setLoading(false);
      if (!!onSuccess) {
        onSuccess(res.data);
        return;
      }
      return res.data;
    } catch(e) {
      setLoading(false);
      const { errors } = e.response.data;
      setErrors(
        <div>
          {!!errors.length && errors.map((error, index) => {
            return (
              <p style={{ color: 'red' }} key={index}>
                {error.message}
              </p>
            );
          })}
        </div>
      );
    }
  }, [url, method, body]);

  return {
    doRequest,
    errors,
    loading,
  };
}

export default useRequest;
