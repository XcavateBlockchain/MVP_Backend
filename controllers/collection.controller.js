import { StatusCodes } from 'http-status-codes'
import { Collection } from '../models/collection.model.js'
import { Property } from '../models/property.model.js'
import { Loan } from '../models/loan.model.js'

export const create = async (req, res) => {
  try {
    const { _id } = req.user
    const { id, owner, seller, propertyId, page, type } = req.body
    
    const collection = new Collection({
      id,
      owner,
      seller,
      user: _id,
      property: propertyId,
      type,
    })
    const doc = await collection.save()

    const property = await Property.findByIdAndUpdate(
      propertyId,
      {
        $set: {
          collect: doc._id,
          isListed: true,
        },
      },
      {
        new: true,
      },
    )
      .populate('user')
      .populate('collect')

    const properties = await Property.find({
      user: _id,
    })
      .populate('user')
      .populate('collect')

    return res.status(StatusCodes.CREATED).send({
      error: null,
      data: page === 'Detail' ? property : properties,
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

export const createLoanCollection = async (req, res) => {
  try {
    const { _id } = req.user
    const { id, owner, loanId, page } = req.body
    
    const collection = new Collection({
      id,
      owner,
      user: _id,
      loan: loanId,
      type: 'loan',
    })
    const doc = await collection.save()

    const loan = await Loan.findByIdAndUpdate(
      loanId,
      {
        $set: {
          collect: doc._id,
          isMinted: true,
        },
      },
      {
        new: true,
      },
    )
      .populate('user')
      .populate('collect')

    const loans = await Loan.find({
      user: _id,
    })
      .populate('user')
      .populate('collect')

    return res.status(StatusCodes.CREATED).send({
      error: null,
      data: page === 'Detail' ? loan : loans,
    })
  } catch (error) {
    console.log('get latest collection id error :: ', error)
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.toString(),
      data: null,
    })
  }
}
