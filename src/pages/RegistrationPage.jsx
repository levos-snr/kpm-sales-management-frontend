import { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';

const RegistrationPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const [success, setSuccess] = useState(''); 
    const [error, setError] = useState(''); 
    const [showModal, setShowModal] = useState(false); 
    const [passwordError, setPasswordError] = useState('');

const isStrongPassword = (password) => {
    const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordPattern.test(password);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
        setPasswordError('Password must be atleast 8 letters long, contain characters, numbers and special characters.');
        return;
    }

    const userData = { name, email, password };
    setLoading(true); 

    try {
        const response = await axios.post('http://localhost:5000/register', userData); 
        setSuccess('Congratulations! Account has been successfully created!');
        setError('');
        setPasswordError('');

        setShowModal(true);
        setTimeout(() => {
            window.location.href = '/login'; // Redirect to login page
        }, 5000); 
    } catch (error) {
        console.error('Registration failed:', error);
        setError('This email is already in use. Please use another one.');
        setSuccess('');
        setPasswordError('');
    } finally {
        setLoading(false);
    }
};

const handleClose = () => setShowModal(false);

return (
    <div className="flex min-h-screen font-sans">
        <div className="w-1/3 flex items-center justify-center bg-white px-10">
            <div className="w-full max-w-md p-10 rounded-2xl">
                <h1 className="text-4xl font-semibold mb-8">Create Your Account</h1>
                {error && <div className="text-red-500 text-center mb-6">{error}</div>}
                {success && <div className="text-green-500 text-center mb-6">{success}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="name" className="sr-only">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="w-full px-5 py-3 mt-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full px-5 py-3 mt-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError('');
                            }}
                            placeholder="Create a strong password"
                            required
                            className="w-full px-5 py-3 mt-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
                        />
                        {passwordError && <small className="text-red-600">{passwordError}</small>}
                    </div>

                    <button type="submit" className="w-full py-3 mt-4 bg-black text-white font-medium rounded-xl text-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md">
                        {loading ? <Spinner animation="border" role="status" size="sm" /> : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <span className="text-sm text-gray-600">Already have an account?</span>
                    <a href="/login" className="text-sm font-medium text-gray-800 hover:underline ml-1">
                        Login here
                    </a>
                </div>
            </div>
        </div>

        {/* Right Side: Image or Design Element */}
        <div className="w-2/3 bg-gray-100 flex items-center justify-center">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://via.placeholder.com/600')" }}>
                <div className="w-full h-full bg-black opacity-30"></div>
            </div>
        </div>

        {/* Modal for Successful Registration */}
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-black">Successful Registration</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <h5>{success}</h5>
                <p className="text-muted">You will be redirected to the login page shortly.</p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-black" onClick={handleClose}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    </div>
);
};

export default RegistrationPage;