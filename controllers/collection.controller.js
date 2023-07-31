import { StatusCodes } from 'http-status-codes'
import { Collection } from '../models/collection.model.js'

export const create = async (req, res) => {
  try {
    const { _id } = req.user
    const { id, owner } = req.body

    const collection = new Collection({
      id,
      owner,
      user: _id,
    })
    const doc = await collection.save()

    return res.status(StatusCodes.CREATED).send({
      error: null,
      data: doc,
    })
  } catch (error) {
    console.log('collection creation error :: ', error)
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.toString(),
      data: null,
    })
  }
}

export const getLastId = async (req, res) => {
  try {
    const latestCollection = await Collection.findOne().sort({ createdAt: -1, })
    if (latestCollection) {
      return res.status(StatusCodes.OK).send({
        error: null,
        data: latestCollection?.id,
      })
    } else {
      return res.status(StatusCodes.OK).send({
        error: null,
        data: 0,
      })
    }
  } catch (error) {
    console.log('get latest collection id error :: ', error)
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.toString(),
      data: null,
    })
  }
}