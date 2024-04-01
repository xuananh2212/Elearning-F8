const { object, string, date, number } = require("yup");
const DiscountTransformer = require("../../transformers/discount.transformer");
const discountServices = require('../../services/discount.services');
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {
               const discounts = await discountServices.findAllDiscount();
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
                                   const discount = await discountServices.findOneByTypeDiscount(discountType);
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
               const discount = await discountServices.createDiscount(body);
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
               let discount = await discountServices.findByPkDiscount(id);
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
                                   const discountFind = await discountServices.findOneByTypeAndDifferent(id, discountType)
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
               discount = await discountServices.updateDiscount(id, body);
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
               const discount = await discountServices.findByPkDiscount(id);
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
               await discountServices.deleteManyDiscount(discountIds);
               Object.assign(response, {
                    status: 200,
                    message: 'delete success',
                    discountIds
               });

          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: e.message
               });

          }
          return res.status(response.status).json(response);
     }
}