exports.getSortFields = (param) => {
  const FILTERS_SEPARATOR = ';';
  const VALUES_SEPARATOR = '=';
  const DB_SORT_MAPPINGS = {
    DESC: -1,
    ASC: 1
  };
  let objForBuild = param.split(FILTERS_SEPARATOR);
  objForBuild = objForBuild.map(obj => {
    const sort = obj.split(VALUES_SEPARATOR);
    return {
      name: sort[0],
      value: sort[1]
    }
  });

  const getDbSortValue = (cur) => {
    const value = cur.value.toUpperCase();
    if(!DB_SORT_MAPPINGS[value]) {
      return;
    }
    const dbSortValue = DB_SORT_MAPPINGS[value];
    return dbSortValue;
  };
  const SORTING_MODEL = {
    DATE: (cur) => {
        const sortValue = getDbSortValue(cur)
        return { dateTaken: sortValue };
    },
    LOCATION: (cur) => {
      const sortValue = getDbSortValue(cur)
      return { location: sortValue };
    }
  };
  return objForBuild.reduce((acc, cur) => {
      const sortObj = SORTING_MODEL[cur.name.toUpperCase()](cur);
      if(!Object.values(sortObj)[0])
        return acc;
      acc = {...acc, ...sortObj };

      return acc;
  }, {});
}

exports.getQueryFields = (param) => {
  const startRange = new Date(param);
  const queryRegex = new RegExp(param);
  const query = {$regex: queryRegex, $options: 'i'};
  const queryFields = [];
  queryFields.push({tags: { $in: [queryRegex] }})
  queryFields.push({content : query});
  queryFields.push({location : query});

  if(!isNaN(startRange)) {
    startRange.setHours(0,0,0,0);
    const endRange = new Date(param);
    endRange.setHours(24);

    queryFields.push({dateTaken : { $gt: startRange, $lt: endRange }});
  }
  return queryFields;
}