export const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = "An error occurred", statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message: Array.isArray(message) ? message : [message],
    data: null,
  });
};

export const paginatedResponse = (res, data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message: "Success",
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};