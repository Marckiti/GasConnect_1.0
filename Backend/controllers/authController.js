const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ─── Plantilla base reutilizable ─────────────────────────────────────────────
const emailWrapper = (contenido) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GasConnect</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
          
          <!-- ENCABEZADO -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff6600 0%, #ff8c00 100%); padding: 35px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:700; letter-spacing:1px;">
                🔥 GasConnect
              </h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:13px;">
                Tu distribuidora de gas en Quito
              </p>
            </td>
          </tr>

          <!-- CONTENIDO -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              ${contenido}
            </td>
          </tr>

          <!-- PIE DE PÁGINA -->
          <tr>
            <td style="background-color:#f7f8fa; padding: 20px 40px; border-top: 1px solid #e8e8e8; text-align:center;">
              <p style="margin:0; font-size:12px; color:#999999;">
                Este correo fue generado automáticamente. Por favor no respondas a este mensaje.
              </p>
              <p style="margin:8px 0 0; font-size:12px; color:#999999;">
                © 2026 <strong style="color:#ff6600;">GasConnect</strong> · Escuela Politécnica Nacional · Quito, Ecuador
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── Registro + Correo de Bienvenida ─────────────────────────────────────────
const registerUser = async (req, res) => {
    const { nombre, email, password, role, telefono } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ mensaje: 'El usuario ya existe' });

        const user = await User.create({ nombre, email, password, role, telefono });

        // ── Plantilla: Bienvenida ──────────────────────────────────────────
        const contenidoBienvenida = `
          <h2 style="margin:0 0 10px; color:#1a1a1a; font-size:22px;">
            ¡Bienvenido/a, ${nombre}! 🎉
          </h2>
          <p style="margin:0 0 20px; color:#555555; font-size:15px; line-height:1.6;">
            Tu cuenta en <strong>GasConnect</strong> ha sido creada exitosamente.
            Ya puedes acceder a la plataforma y gestionar tus pedidos de gas de
            forma rápida y segura.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0"
                 style="background:#fff8f3; border-left:4px solid #ff6600;
                        border-radius:6px; padding:16px 20px; margin-bottom:28px;">
            <tr>
              <td style="font-size:14px; color:#444; line-height:1.8;">
                <strong style="color:#ff6600;">📧 Correo:</strong> ${email}<br/>
                <strong style="color:#ff6600;">👤 Rol:</strong> ${role || 'cliente'}
              </td>
            </tr>
          </table>

          <p style="margin:0 0 24px; color:#555555; font-size:14px; line-height:1.6;">
            Con GasConnect puedes:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#444;">
                ✅ &nbsp; Realizar pedidos de cilindros de gas desde casa
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#444;">
                ✅ &nbsp; Rastrear el estado de tu pedido en tiempo real
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#444;">
                ✅ &nbsp; Recibir notificaciones sobre tu entrega
              </td>
            </tr>
          </table>

          <div style="text-align:center; margin-bottom:10px;">
            <a href="#" style="display:inline-block; background: linear-gradient(135deg,#ff6600,#ff8c00);
                               color:#ffffff; text-decoration:none; padding:13px 36px;
                               border-radius:50px; font-size:15px; font-weight:bold;
                               letter-spacing:0.5px;">
              Ir a GasConnect →
            </a>
          </div>

          <p style="margin:24px 0 0; font-size:13px; color:#aaaaaa; text-align:center;">
            Si no creaste esta cuenta, ignora este mensaje.
          </p>
        `;

        const emailHtml = emailWrapper(contenidoBienvenida);

        try {
            await sendEmail({
                email: user.email,
                subject: '¡Bienvenido/a a GasConnect! Tu cuenta está lista 🔥',
                html: emailHtml
            });
        } catch (err) {
            console.error('Error enviando correo de bienvenida:', err.message);
        }

        res.status(201).json({
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// ─── Generar PIN y enviarlo por correo ───────────────────────────────────────
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = crypto.createHash('sha256').update(pin).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutos
        await user.save();

        // Separar PIN en dígitos para mostrarlos en cajas individuales
        const digitosPin = pin.split('').map(d => `
          <td style="width:42px; height:52px; text-align:center; vertical-align:middle;
                     background:#fff; border:2px solid #ff6600; border-radius:8px;
                     font-size:26px; font-weight:bold; color:#ff6600; margin:0 4px;">
            ${d}
          </td>
          <td style="width:8px;"></td>
        `).join('');

        // ── Plantilla: Recuperación de Contraseña ─────────────────────────
        const contenidoRecuperacion = `
          <h2 style="margin:0 0 10px; color:#1a1a1a; font-size:22px;">
            Recuperación de contraseña 🔐
          </h2>
          <p style="margin:0 0 20px; color:#555555; font-size:15px; line-height:1.6;">
            Hola <strong>${user.nombre}</strong>, recibimos una solicitud para
            restablecer la contraseña de tu cuenta en GasConnect.
            Usa el siguiente PIN de 6 dígitos para continuar:
          </p>

          <!-- PIN en cajas -->
          <div style="text-align:center; margin:30px 0;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>${digitosPin}</tr>
            </table>
          </div>

          <!-- Advertencia de expiración -->
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="background:#fff3f3; border-left:4px solid #e53935;
                        border-radius:6px; padding:14px 20px; margin:24px 0;">
            <tr>
              <td style="font-size:13px; color:#b71c1c;">
                ⏱ <strong>Este PIN expira en 15 minutos.</strong>
                Si no solicitaste este cambio, puedes ignorar este correo
                con total seguridad.
              </td>
            </tr>
          </table>

          <p style="margin:0 0 8px; color:#555555; font-size:14px; line-height:1.6;">
            Pasos para restablecer tu contraseña:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
            <tr>
              <td style="padding:5px 0; font-size:14px; color:#444;">
                1️⃣ &nbsp; Ingresa el PIN de 6 dígitos en la pantalla de recuperación
              </td>
            </tr>
            <tr>
              <td style="padding:5px 0; font-size:14px; color:#444;">
                2️⃣ &nbsp; Escribe tu nueva contraseña
              </td>
            </tr>
            <tr>
              <td style="padding:5px 0; font-size:14px; color:#444;">
                3️⃣ &nbsp; ¡Listo! Inicia sesión con tu nueva contraseña
              </td>
            </tr>
          </table>

          <p style="margin:0; font-size:13px; color:#aaaaaa; text-align:center;">
            Por seguridad, nunca compartas este PIN con nadie,
            incluyendo al equipo de GasConnect.
          </p>
        `;

        const messageHtml = emailWrapper(contenidoRecuperacion);

        try {
            await sendEmail({
                email: user.email,
                subject: 'PIN de recuperación de contraseña – GasConnect 🔐',
                html: messageHtml
            });
            res.json({ mensaje: 'PIN enviado al correo electrónico' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ mensaje: 'No se pudo enviar el correo' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// ─── Validar PIN y actualizar contraseña ─────────────────────────────────────
const resetPassword = async (req, res) => {
    const { pin, newPassword } = req.body;
    try {
        const hashedPin = crypto.createHash('sha256').update(pin).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedPin,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ mensaje: 'PIN incorrecto o expirado' });

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
