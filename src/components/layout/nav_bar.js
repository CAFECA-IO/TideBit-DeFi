import Link from 'next/link';
import TideButton from '../shared/button/tide_button';
import { useState } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import { BsFillBellFill } from 'react-icons/bs';
import { TbMinusVertical } from 'react-icons/tb';
import { FiMenu } from 'react-icons/fi';
import { TfiBell } from 'react-icons/tfi';
import { BsBell } from 'react-icons/bs';
import TideLink from '../shared/link/tide_link';
import ConnectButton from '../wallet/connect_button';

const NavBar = () => {
	const [navOpen, setNavOpen] = useState(false);
	const clickHanlder = () => setNavOpen(!navOpen);
	return (
		<div className="fixed inset-x-0 z-50">
			<nav className="bg-opacity-100 bg-black text-white">
				<div className="max-w-7xl mx-auto px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center">
							{/* logo */}
							<Link className="flex-shrink-0" href="/">
								<div className="pt-5 pl-5 inline-flex items-center hover:cursor-pointer hover:opacity-100 hover:text-cyan-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="w-10 h-10 text-white p-2 bg-cyan-600 rounded-full"
										viewBox="0 0 24 24"
									>
										<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
									</svg>
									<span className="ml-3 text-xl">TideBit</span>
								</div>
							</Link>
							{/* Desktop menu */}
							<div className={`pb-2 hidden lg:block`}>
								<div className="ml-10 flex flex-1 items-center mt-5 space-x-4">
									<TideLink href="#" className="" content={'Trading'} />
									<TideLink
										href="#"
										className="mr-5"
										content={'TideBit University'}
									/>
									<TideLink href="#" className="mr-5" content={'Help Center'} />

									{/* <div className="max-w-2xl mx-auto"></div> */}
								</div>
							</div>
						</div>
						<div className="pt-3 lg:flex hidden">
							<div className="items-center flex justify-center px-5">
								<AiOutlineGlobal
									size={24}
									className="hover:cursor-pointer hover:text-cyan-300"
								/>
								<TbMinusVertical size={30} className="" />

								<BsBell
									size={23}
									className="hover:cursor-pointer hover:text-cyan-300"
								/>
							</div>
							<div className="inline-flex mr-5">
								<ConnectButton />
							</div>
						</div>

						{/* Mobile menu toggle */}
						<div className="pt-3 -mr-2 flex lg:hidden">
							<button
								onClick={clickHanlder}
								className="hover:text-cyan-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
							>
								{!navOpen ? (
									<FiMenu size={30} className="" />
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 text-white hover:text-cyan-300"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				<div className={`lg:hidden ${navOpen ? '' : 'hidden'}`}>
					<div className="inline-block items-center px-2 ml-10 text-baseline pt-2 pb-3 sm:px-3">
						<div className="space-y-1">
							<TideLink
								href="#"
								className="block px-3 py-2 rounded-md text-base font-medium"
								content={'Trading'}
							/>

							<TideLink
								href="#"
								className="block px-3 py-2 rounded-md text-base font-medium"
								content={'TideBit University'}
							/>
							<TideLink
								href="#"
								className="block px-3 py-2 rounded-md text-base font-medium"
								content={'Help Center'}
							/>
						</div>
						<div className="pt-3">
							<div className="items-center flex justify-start px-3">
								<AiOutlineGlobal
									size={24}
									className="hover:cursor-pointer hover:text-cyan-300"
								/>
								<TbMinusVertical size={30} className="" />

								<BsBell
									size={23}
									className="hover:cursor-pointer hover:text-cyan-300"
								/>
							</div>
						</div>
						<div className="mt-5">
							<ConnectButton className="ml-2" />
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default NavBar;
