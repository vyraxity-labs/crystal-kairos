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
      <li><strong>Name:</strong> ${user.name}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      ${user.membershipNumber ? `<li><strong>Membership #:</strong> ${user.membershipNumber}</li>` : ''}
    </ul>
    <p>Please review the registration in your admin dashboard.</p>
  `
  const text = `
New Member Registration

A new user has successfully registered on Crystal Kairos.

Name: ${user.name}
Email: ${user.email}
${user.membershipNumber ? `Membership #: ${user.membershipNumber}` : ''}

Please review the registration in your admin dashboard.
  `
  return { subject, html, text }
}
