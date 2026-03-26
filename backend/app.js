const express =require('express');
const path =require('path');
const dotenv =require('dotenv');
const AppError = require('./utilities/appError')
dotenv.config();

const dbConnect =require('./config/db.config');
const corsMiddleware =require('./middlewares/cors.middleware')

const init = async ()=>{
  await dbConnect();
  const app =express();

  app.use(corsMiddleware);
  app.use(express.json());
  app.use('/uploads',express.static(path.join(__dirname , 'uploads')));
  
  app.use('/api/v1/auth' , require('./routes/auth.route'))
  app.use('/api/v1/user', require('./routes/user.route'))
  app.use('/api/v1/product' , require('./routes/product.route'))
  app.use('/api/v1/category' , require('./routes/category.route'));
  app.use('/api/v1/subcategory' , require('./routes/subcategory.route'));
  app.use('/api/v1/cart' , require('./routes/cart.route'));
  app.use('/api/v1/order' , require('./routes/order.route'));
  app.use('/api/v1/testimonial' , require('./routes/testimonial.route'));
  app.use('/api/v1/page' , require('./routes/page.route'));
  app.use('/api/v1/report' , require('./routes/report.route'));
  app.use('/api/v1/admin' , require('./routes/admin.route'));




  // Handling unhandled routes
  // the new version of node & express didnt accept (*) should put a parametar name like(*wrongRoutes)
  app.all('*wrongRoutes', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  // Globl error handler (should be the last)
  app.use((err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  });

  const port =process.env.PORT;
  app.listen(port, ()=>{
  console.log(`Server started at port ${port}`);
  });
};

init();