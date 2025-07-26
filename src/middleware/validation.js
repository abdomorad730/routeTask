export const validation = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const key of Object.keys(schema)) {
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        const formattedErrors = error.details.map(detail => ({
          message: detail.message,
          path: detail.path.join('.')
        }));
        errors.push(...formattedErrors); 
      }
    }

    if (errors.length) {
      return res.status(400).json({ msg: "Validation Error", errors });
    }

    next();
  };
};
