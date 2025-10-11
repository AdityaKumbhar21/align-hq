import sgMail from '@sendgrid/mail';


sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const sendEmail = async(users: any, {taskTitle, deadline, projectTitle}: any)=>{
    const emailPromises = users.map(async (user: any)=>
        await sgMail.send({to: user.email,
        from: "adityakumbhar915@gmail.com",
        subject: `New Task Assigned: ${taskTitle}`,
        html: `
            <p>Hi ${user.fullName},</p>
            <p>You have been assigned a new task in <b>${projectTitle}</b>:</p>
            <p><b>${taskTitle}</b></p>
            <p>Deadline: <b>${new Date(deadline).toLocaleString()}</b></p>
            <p>Please check the dashboard for more details.</p>
            `,})
        
    )
    await Promise.all(emailPromises)
}

