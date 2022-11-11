import { useState } from 'react';
import tideButton from '../shared/button/tide_button';
import tideLink from '../shared/link/tide_link';
import { AiOutlineGlobal } from 'react-icons/ai';
import { BsFillBellFill } from 'react-icons/bs';
import { TbMinusVertical } from 'react-icons/tb';
import { FiMenu } from 'react-icons/fi';

import React from 'react';
import Link from 'next/link';

const NavBar = () => {
	const [navOpen, setNavOpen] = useState(true);

	const TideButton = tideButton;

	const TideLink = tideLink;

	const clickHandler = () => setNavOpen(!navOpen);

	return (
		<>
			<header className="text-white bg-black body-font fixed inset-x-0 z-40">
				<div className="flex flex-1 flex-wrap py-5 flex-col lg:flex-row items-center">
					<div className="flex justify-between">
						<div className="text-center xl:space-x-36 flex items-center justify-evenly title-font font-medium text-white mb-4 md:mb-0">
							<Link href="/">
								<div className="pl-5 inline-flex items-center hover:cursor-pointer hover:opacity-80">
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

							<div className="ml-20 items-center justify-center lg:hidden">
								<button className="" onClick={clickHandler}>
									{navOpen ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-6 h-6 text-white"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<FiMenu size={30} className="" />
									)}
								</button>
							</div>
						</div>
					</div>

					<nav
						className={`${
							navOpen ? '' : 'hidden'
						} lg:ml-auto flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:flex-nowrap xl:flex-wrap items-center text-base justify-center`}
					>
						<TideLink href="#" className="mr-5" content={'Trading'} />
						<TideLink href="#" className="mr-5" content={'TideBit University'} />
						<TideLink href="#" className="mr-5" content={'Help Center'} />

						<div className="flex justify-center md:px-2 lg:px-5">
							<AiOutlineGlobal
								size={30}
								className="hover:cursor-pointer hover:text-cyan-300"
							/>
							<TbMinusVertical size={30} className="" />
							<BsFillBellFill
								size={28}
								className="hover:cursor-pointer hover:text-cyan-300"
							/>
						</div>
						<TideButton
							isHover={false}
							isFocus={true}
							className="lg:mr-5"
							content={`Wallet Connect`}
						/>
					</nav>
				</div>
			</header>
		</>
	);
};

export default NavBar;
