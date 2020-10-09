const generatePathParams = (params) => {
  let params_list = [];
  const addParameter = (key, value) => params_list.length > 0 ? params_list.push(`&${key}=${value}`) : params_list.push(`${key}=${value}`);
  for(const key in params) {
    addParameter(key, params[key]);
  }

  return params_list.join('');
}

module.exports = {
  generatePathParams,
}