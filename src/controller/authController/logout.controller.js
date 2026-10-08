export const logout = (req, res) => {
  try {
    // Coincide con el nombre y las opciones de la cookie creada en el login.
    res.clearCookie('token', { httpOnly: true, path: '/' });
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch {
    return res.status(500).json({ message: 'Error al cerrar la sesión' });
  }
};
