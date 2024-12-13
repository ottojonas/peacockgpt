1. Project Overview

```markdown
# PeacockGPT

PeacockGPT is a web application that provides a sleek and intuitive interface for interacting with GPT models. The application features a sidebar with various navigation options and a main content area for displaying chat interactions, user settings, and more.

## Features
- Interactive chat interface with GPT models
- User management
- Customizable themes
- Dashboard for monitoring usage
- Settings for configuring application preferences

```

### 2. Installation Instructions

```markdown
## Installation

To get started with PeacockGPT, follow these steps:

### Prerequisites
- Node.js (>=14.x)
- npm (>=6.x) or yarn (>=1.x)

### Clone the Repository
```bash
git clone <https://github.com/yourusername/peacockgpt.git>
cd peacockgpt
```


### Install Dependencies

Using npm:

```bash
npm install

```

Using yarn:

```bash
yarn install

```

Using pip: 

```bash
pip install -r requirements.txt
```

Using pip in a virtual environment 

To avoid the `externally-managed-environment` error, you should create a virtual environment and install the dependencies within it. Here are the steps:

1. Create a virtual environment:
    
    ```bash
    python -m venv ../peacockgpt/backend/venv
    ```
    
2. Activate the virtual environment:
    
    ```bash
    source ../peacockgpt/backend/venv/bin/activate
    ```
    
3. Install the dependencies using `pip`:
    
    ```bash
    pip install -r ../peacockgpt/backend/requirements.txt
    ```
    

This will install the dependencies in the virtual environment, avoiding conflicts with the system-wide Python installation.

### Start the Development Server

Using npm:

```bash
npm run dev

```

Using yarn:

```bash
yarn dev

```

### Build for Production

Using npm:

```bash
npm run build

```

Using yarn:

```bash
yarn build

```

### 3. Usage Guide

## Usage

### Running the Application

After starting the development server, open your browser and navigate to `http://localhost:3000` to view the application.

### Navigating the Sidebar

- **Dashboard**: View overall usage statistics and application status.
- **Chat**: Interact with GPT models in a chat interface.
- **Users**: Manage user accounts and permissions.
- **Settings**: Configure application preferences and settings.
- **Theme**: Toggle between different themes.
- **Logout**: Sign out of the application.

### Customizing Themes

To customize the theme, click on the theme icon in the sidebar and select your preferred theme from the available options.

### 4. Component Documentation

## Component Documentation

### Sidebar

The `Sidebar` component is a fixed navigation menu located on the left side of the application. It contains icons for navigating to different sections of the application.

#### Props

- `Props`: An empty object.

#### Usage

```tsx
import Sidebar from "@/components/Sidebar";

function App() {
  return (
    <div>
      <Sidebar />
      {/* Other components */}
    </div>
  );
}

```

### Subcomponents

- **GPTLogo**: Displays the GPT logo.
- **DashboardIcon**: Icon for the dashboard section.
- **ChatIcon**: Icon for the chat section.
- **UsersIcon**: Icon for the users section.
- **SettingsIcon**: Icon for the settings section.
- **ThemeIcon**: Icon for the theme toggle.
- **LogoutIcon**: Icon for logging out.

### 5. API Documentation

## API Documentation

### Endpoints

#### GET /api/chat

Fetches chat history.

#### POST /api/chat

Sends a new message to the GPT model.

#### GET /api/users

Fetches a list of users.

#### POST /api/users

Creates a new user.

### Request and Response Examples

#### GET /api/chat

**Request:**

```http
GET /api/chat HTTP/1.1
Host: localhost:3000

```

**Response:**

```json
[
  {
    "id": "1",
    "message": "Hello, how can I help you?",
    "timestamp": "2023-01-01T12:00:00Z"
  }
]
```

### POST /api/chat

**Request:**

POST /api/chat HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "message": "What is the weather like today?"
}

**Response:**

```json
{
  "id": "2",
  "message": "The weather is sunny with a high of 25°C.",
  "timestamp": "2023-01-01T12:01:00Z"
}

```

### 6. Contributing Guidelines

## Contributing

We welcome contributions to PeacockGPT! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

Please ensure your code follows our coding standards and includes appropriate tests.

### 7. License Information

## License

PeacockGPT is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
