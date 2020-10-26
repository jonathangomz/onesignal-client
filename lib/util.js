const generatePathParams = (params) => {
  let params_list = [];
  const addParameter = (key, value) => params_list.length > 0 ? params_list.push(`&${key}=${value}`) : params_list.push(`${key}=${value}`);
  for(const key in params) {
    addParameter(key, params[key]);
  }

  return params_list.join('');
}

const mapMessageToOS = (message) => {
  return {
    headings: message.heading,
    subtitle: message.subtitle,
    contents: message.content,
  }
}

const mapTargetsToOS = (targets) => {
  const os_targets = {};

  if(targets.to.type === 'segments') {
    os_targets.included_segments = targets.to.value;
    os_targets.filters = targets.filters;
  }else if(targets.to.type === 'users') {
    os_targets.include_player_ids = targets.to.value; 
  }else if(targets.to.type === 'external') {
    os_targets.include_external_user_ids = targets.to.value;
  }

  return os_targets;
}

module.exports = {
  generatePathParams,
  mapMessageToOS,
  mapTargetsToOS,
}