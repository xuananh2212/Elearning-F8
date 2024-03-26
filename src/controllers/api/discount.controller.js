const { Discount, Course } = require("../../models/index");
const { object, string, date, number } = require("yup");
const { v4: uuidv4 } = require("uuid");
const { Op } = require('sequelize');
const DiscountTransformer = require("../../transformers/discount.transformer");
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {
               const discounts = await Discount.findAll();
               const discountTransformer = new DiscountTransformer(discounts);
               console.log(discounts);
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    discounts: discountTransformer
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: 'bad request'
               })

          }
          return res.status(response.status).json(response);
     },
     handleAddDiscount: async (req, res) => {
          const response = {};
          try {
               const discountSchema = object(
                    {
                         discountType: string()
                              .required("vui lòng nhập kiểu khuyến mãi")
                              .test("unique", "loại khuyến mại này đã tồn tại!", async (discountType) => {
                                   const discount = await Discount.findOne(
                                        {
                                             where: {
                                                  discount_type: discountType
                                             }
                                        })
                                   return !discount;
                              }),
                         percent: number()
                              .required("vui lòng nhập phần trăm"),
                         expired: date()
                              .test("checkDate", "vui lòng chọn ngày hết hạn lớn hơn hiện tại!", (value) => {
                                   if (value) {
                                        const dateNow = new Date();
                                        console.log(dateNow);
                                        console.log(value?.getTime(), dateNow?.getTime());
                                        return value?.getTime() > dateNow?.getTime();
                                   }
                                   return true;

                              })

                    });
               const body = await discountSchema.validate(req.body, { abortEarly: false });
               //expreired
               const { discountType, percent, quantity, expired } = body;
               const discount = await Discount.create({ id: uuidv4(), discount_type: discountType, percent, quantity, expired });
               const discountTransformer = new DiscountTransformer(discount);
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    discount: discountTransformer
               });

          } catch (e) {
               console.log(e);
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    message: "bad request",
                    errors

               });
          }
          return res.status(response.status).json(response);
     },
     handleEditDiscount: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const discount = await Discount.findByPk(id);
               if (!discount) {
                    return res.status(404).json({
                         status: 404,
                         message: 'discount không tồn tại!'
                    })
               }

               const discountSchema = object(
                    {
                         discountType: string()
                              .required("vui lòng nhập kiểu khuyến mãi")
                              .test("unique", "loại khuyến mại này đã tồn tại!", async (discountType) => {
                                   const discountFind = await Discount.findOne(
                                        {
                                             where: {
                                                  [Op.and]: {
                                                       discount_type: discountType,
                                                       id: {
                                                            [Op.ne]: id
                                                       }
                                                  }

                                             }
                                        })
                                   return !discountFind;
                              }),
                         percent: number()
                              .required("vui lòng nhập phần trăm"),
                         expired: date()
                              .test("checkDate", "vui lòng chọn ngày hết hạn lớn hơn hiện tại!", (value) => {
                                   if (value) {
                                        const dateNow = new Date();
                                        console.log(dateNow);
                                        console.log(value?.getTime(), dateNow?.getTime());
                                        return value?.getTime() > dateNow?.getTime();
                                   }
                                   return true;

                              })

                    });
               const body = await discountSchema.validate(req.body, { abortEarly: false });
               const { discountType, percent, quantity, expired } = body;
               discount.discount_type = discountType;
               discount.percent = percent;
               discount.quantity = quantity;
               discount.expired = expired;
               await discount.save();
               const discountTransformer = new DiscountTransformer(discount);
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    discount: discountTransformer
               });

          } catch (e) {
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    message: "bad request",
                    errors
               });
          }
          return res.status(response.status).json(response);
     },
     handleDeleteDiscount: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const discount = await Discount.findByPk(id);
               if (!discount) {
                    return res.status(404).json({
                         status: 404,
                         message: 'discount không tồn tại!'
                    })
               }
               discount.setCourses([]);
               await discount.destroy();
               Object.assign(response, {
                    status: 200,
                    message: 'delete success',
                    discountId: id
               })

          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e?.message
               })

          }
          return res.status(response.status).json(response);
     },
     handleDeleteManyDiscount: async (req, res) => {
          const response = {};
          const { discountIds } = req.body;
          try {
               if (!Array.isArray(discountIds)) {
                    throw new Error('Định dạng dữ liệu không hợp lệ!');
               }
               if (discountIds.length === 0) {
                    throw new Error('danh sách id rỗng!');
               }
               await Discount.destroy({
                    where: {
                         id: discountIds
                    }
               });
               Object.assign(response, {
                    status: 200,
                    message: 'delete success',
                    discountIds
               });

          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e.message
               });

          }
          return res.status(response.status).json(response);
     }
}