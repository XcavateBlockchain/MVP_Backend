import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.toString(),
      data: null,
    })
  }
}
