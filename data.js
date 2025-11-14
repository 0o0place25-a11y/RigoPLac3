// ========================================
// DATOS DE PRODUCTOS / PRODUCT DATA
// ========================================

const mine = [
  {
    id: '1',
    title: "Bicicleta urbana",
    price: 650,
    city: "Guatemala",
    category: "Ropa",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmljeWNsZXxlbnwwfHwwfHx8MA==&fm=jpg&q=60&w=3000",
    description: "Bicicleta de montaña en excelente estado, perfecta para la ciudad. Incluye casco y candado.",
    condition: "Usado - Como nuevo"
  },
  {
    id: '2',
    title: "Silla gamer",
    price: 950,
    city: "Mixco",
    category: "Hogar",
    image: "https://via.placeholder.com/300x200.png?text=Silla+Gamer",
    description: "Silla gamer reclinable con soporte lumbar. Muy cómoda para largas sesiones de trabajo o juego.",
    condition: "Usado - Buen estado"
  }
];

const feed = [
  {
    id: '3',
    title: "Brownie casero",
    price: 15,
    city: "Guatemala",
    category: "Comida",
    image: "https://images.unsplash.com/photo-1636743715220-d8f8dd900b87?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvd25pZXxlbnwwfHwwfHx8MA==&fm=jpg&q=60&w=3000",
    description: "Brownies artesanales hechos con chocolate belga. Receta familiar transmitida por generaciones.",
    condition: "Nuevo"
  },
  {
    id: '4',
    title: "Arduino UNO",
    price: 180,
    city: "Mixco",
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJkdWlub3xlbnwwfHwwfHx8MA==&fm=jpg&q=60&w=3000",
    description: "Arduino UNO R3 original. Perfecto para proyectos de electrónica y robótica. Incluye cable USB.",
    condition: "Nuevo"
  },
  {
    id: '5',
    title: "Cojín artesanal",
    price: 90,
    city: "Guatemala",
    category: "Hogar",
    image: "https://via.placeholder.com/300x200.png?text=Cojin+Artesanal",
    description: "Cojín decorativo hecho a mano con telas guatemaltecas. Diseño único y colorido.",
    condition: "Nuevo"
  }
];

const all = [...mine, ...feed];