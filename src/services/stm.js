import axios from 'axios'

const API_URL = 'http://localhost:7070'

export const getStmLines = async () => {
  return await axios
    .get(`${API_URL}/busLines`)
    .then(result => result.data)
    .catch(error => {
      return error
    })
}

export const getStmStops = async (route, direction) => {
  const result = await axios
    .get(
      `${API_URL}/busStops?route=${route}&direction=${direction}`
    )
    .then(result => result.data)
    .catch(error => {
      return ''
    })
  if (!result && direction === 'O') {
    return await axios
      .get(
        `${API_URL}/busStops?route=${route}&direction=W`
      )
      .then(result => result.data)
      .catch(error => {
        return error
      })
  }
  return result
}

export const getStmArrivals = async (route, direction, stopCode) => {
  const result = await axios
    .get(
      `${API_URL}/busArrivals?route=${route}&direction=${direction}&stopCode=${stopCode}`
    )
    .then(result => result.data)
    .catch(error => {
      return error
    })

  if (!result && direction === 'O') {
    return await axios
      .get(
        `${API_URL}/busArrivals?route=${route}&direction=W&stopCode=${stopCode}`
      )
      .then(result => result.data)
      .catch(error => {
        return error
      })
  }
  return result
}

export const getBusPos = async (route, direction) => {
  const result = await axios
    .get(
      `${API_URL}/busPositions?route=${route}&direction=${direction}`
    )
    .then(result => result.data)
    .catch(error => {
      return ''
    })
    if (!result && direction === 'O') {
      return await axios
      .get(
        `${API_URL}/busPositions?route=${route}&direction=W`
      )
        .then(result => result.data)
        .catch(error => {
          return error
        })
    }
  return result
}

export const getFavorites = async () => {
  const result = await axios
    .get(
      `${API_URL}/favorites`
    )
    .then(result => result.data)
    .catch(error => {
      console.log(error)
      return ''
    })
    
  return result
}

export const addFavorites = async (route, direction, stopCode, name, lat, lon) => {
  await axios.post(
    `${API_URL}/favorites?route=${route}&direction=${direction}&stopCode=${stopCode}&name=${name}&lat=${lat}&lon=${lon}`
    )
    .then(result => result.data)
    .catch(error => {
      alert(error.response.data.message)
      return ''
    })
}

export const deleteFavorites = async (route, direction, stopCode, name, lat, lon) => {
  await axios.delete(
    `${API_URL}/favorites?route=${route}&direction=${direction}&stopCode=${stopCode}&name=${name}&lat=${lat}&lon=${lon}`
    )
    .then(result => result.data)
    .catch(error => {
      console.log(error)
      return ''
    })
}

export const getArrivalsSoon = async () => {
  return await axios.get(
    `${API_URL}/arrivals`
    )
    .then(result => {
      return result.data
    })
    .catch(error => {
      alert(error.response.data.message)
      return ''
    })
}

