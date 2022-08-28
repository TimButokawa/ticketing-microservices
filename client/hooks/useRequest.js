import axios from 'axios';
import React from 'react';

const useRequest = ({
  body,
  method,
  url,
}) => {
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const doRequest = React.useCallback(async () => {
    setLoading(true);
    setErrors([]);
    try  {
      const res = await axios[method](url, body);
      setLoading(false);
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
