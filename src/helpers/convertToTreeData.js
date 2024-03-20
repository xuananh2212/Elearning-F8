const convertToTreeData = (categories) => {
     return categories.map(category => ({
          title: category.name,
          value: category.id,
          key: category.id,
          children: category.children?.length > 0 ? convertToTreeData(category.children) : undefined
     }));
}
const buildTree = (categories) => {
     const categoryMap = {};
     const rootCategories = [];

     // Tạo một bản đồ với key là id của từng danh mục
     categories.forEach(category => {
          category.children = [];
          categoryMap[category.id] = category;
     });
     // Xây dựng cây danh mục
     categories.forEach(category => {
          // Nếu danh mục có parentId, thêm nó vào mục con của parent
          if (category.parent_id && categoryMap[category.parent_id]) {
               categoryMap[category.parent_id].children.push(category);
          } else {
               // Nếu không, nó là một category gốc
               rootCategories.push(category);
          }
     });

     return rootCategories;
}
module.exports = { convertToTreeData, buildTree };