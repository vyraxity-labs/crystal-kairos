export function getRegistrationNotificationEmail(user: {
  name: string
  email: string
  membershipNumber?: string
}) {
  const subject = `New Member Registration: ${user.name}`
  const html = `
    <h2>New Member Registration</h2>
    <p>A new user has successfully registered on Crystal Kairos.</p>
    <ul>
      <li><strong>Name:</strong> ${user.name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>
      <li><strong>Email:</strong> ${user.email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>
      ${user.membershipNumber ? `<li><strong>Membership #:</strong> ${user.membershipNumber.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>` : ''}
    </ul>
    <p>Please review the registration in your admin dashboard.</p>
  `
  const text = `
New Member Registration

A new user has successfully registered on Crystal Kairos.

Name: ${user.name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
Email: ${user.email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
${user.membershipNumber ? `Membership #: ${user.membershipNumber}` : ''}

Please review the registration in your admin dashboard.
  `
  return { subject, html, text }
}
