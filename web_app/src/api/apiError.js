class ApiError extends Error {
  constructor(res, body) {
    super(body.message || res.statusText);
    this.status = res.status;
    this.type = body.type;
    this.name = 'ApiError';
  }
}

export default ApiError;
