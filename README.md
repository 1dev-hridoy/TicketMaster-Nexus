<img src="https://github.com/user-attachments/assets/9ca9ce83-05ea-4dfc-84da-cca276125482" alt="Eliana Bot Banner">
# TicketMaster Nexus

TicketMaster Nexus is an advanced Discord ticket bot designed to streamline your server's support system. With features like ticket priority management, archiving, statistics, and support role control, it offers a comprehensive solution for managing user inquiries and support requests.

## Features

- Create and manage support tickets
- Set ticket priorities (Low, Normal, High, Urgent)
- Archive closed tickets for future reference
- View ticket statistics
- Manage support roles
- Transfer ticket ownership
- Customizable ticket categories

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js v16.9.0 or higher
- npm (Node Package Manager)
- A Discord account and a registered Discord application/bot

## Installation

1. Clone the repository:
   ```
   git https://github.com/1dev-hridoy/TicketMaster-Nexus.git
   ```

2. Navigate to the project directory:
   ```
   cd ticketmaster-nexus
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

4. Create a `config.json` file in the root directory with the following content:
   ```json
   {
     "token": "YOUR_BOT_TOKEN",
     "clientId": "YOUR_BOT_CLIENT_ID",
     "guildId": "YOUR_GUILD_ID",
     "ticketCategory": "Tickets"
   }
   ```

   Replace `YOUR_BOT_TOKEN`, `YOUR_BOT_CLIENT_ID`, and `YOUR_GUILD_ID` with your actual bot token, client ID, and the ID of the Discord server where you'll be using the bot.

## Usage

1. Start the bot:
   ```
   node index.js
   ```

2. In your Discord server, use the following commands:

   - `/new-ticket`: Set up the ticket creation message
   - `/list-tickets`: View all open tickets
   - `/close-ticket`: Close and archive the current ticket
   - `/ticket-stats`: View ticket statistics
   - `/manage-support-roles`: Add or remove support roles
   - `/set-priority`: Set the priority of the current ticket
   - `/transfer-ticket`: Transfer ticket ownership to another user


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, please open an issue on the GitHub repository.

Thank you for using TicketMaster Nexus!
