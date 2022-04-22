import { Form, Formik } from "formik";
import { useAlert } from "react-alert";
import * as Yup from "yup";
import SourceService from "../../services/SourceService";
import Button from "../../ui/Button";
import Loader from "../../ui/Loader/Loader";
const RangeSimpleForm = ({ data, selectedRow, onClose, setLoading }) => {
	const alert = useAlert();
	return (
		<Formik
			initialValues={{
				nlower: 0,
				n: data.n !== null ? data.n : 15,
				p: data.p !== null ? data.p : 50,
				l: data.l !== null ? data.l : 85,
				f: 100,
			}}
			validationSchema={() => {
				return Yup.lazy((values) => {
					return Yup.object().shape({
						nlower: Yup.number()
							.min(0, "N lower must be 0.")
							.max(0, "N lower must be 0."),
						n: Yup.number()
							.lessThan(100, "N must be less than 100")
							.moreThan(
								values.nlower < 100 ? values.nlower : 0,
								"N must be bigger than " + values.nlower
							),
						p: Yup.number()
							.lessThan(100, "P- must be less than 100")
							.moreThan(
								values.n < 100 ? values.n : 0,
								"P must be bigger than " + values.n
							),
						l: Yup.number()
							.lessThan(100, "P- must be less than 100")
							.moreThan(
								values.p < 100 ? values.p : 0,
								"L must be bigger than " + values.p
							),
					});
				});
			}}
			onSubmit={(values, { setSubmitting }) => {
				const scoreRanges = {
					n: values.n,
					p: values.p,
					l: values.l,
					pminus: null,
					pplus: null,
					lminus: null,
					lplus: null,
					mode: "SIMPLE",
				};
				setSubmitting(true);
				SourceService.updateScoreRanges(selectedRow.id, scoreRanges)
					.then(() => {
						alert.info("Source ranges updated.");
						onClose();
					})
					.catch((e) => {
						if (e.response?.data && e.response.data?.message) {
							alert.error(e.response.data.message);
						} else {
							alert.error("There was error updating ranges!");
						}
						onClose();
					});
			}}
		>
			{({ errors, touched, values, handleChange, isSubmitting }) => (
				<Form className='grid content-center grid-cols-4 px-4 space-y-2 text-center place-content-center'>
					{/*N*/}
					<label htmlFor='N' className='pt-2 pl-4 text-lg font-bold text-left'>
						N
					</label>
					<input
						type='number'
						name='nlower'
						className='border border-gray-400 rounded'
						disabled
						value={values.nlower}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='n'
						className='border border-gray-400 rounded '
						value={values.n}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span>{errors.nlower && touched.nlower && errors.nlower}</span>
						<span>{errors.n && touched.n && errors.n}</span>
					</div>

					{/*P*/}
					<label htmlFor='P' className='pl-4 text-lg font-bold text-left'>
						P
					</label>
					<input
						type='number'
						name='n'
						className='border border-gray-400 rounded '
						value={values.n}
						disabled
					></input>

					<label> &lt; X &le;</label>
					<input
						type='number'
						name='p'
						className='border border-gray-400 rounded '
						value={values.p}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span></span>
						<span>{errors.p && touched.p && errors.p}</span>
					</div>
					{/*L*/}
					<label htmlFor='L' className='pl-4 text-lg font-bold text-left'>
						L
					</label>
					<input
						type='number'
						name='p'
						className='border border-gray-400 rounded'
						disabled
						value={values.p}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='l'
						className='border border-gray-400 rounded '
						value={values.l}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span></span>
						<span>{errors.l && touched.l && errors.l}</span>
					</div>
					{/*F*/}
					<label htmlFor='F' className='pl-4 text-lg font-bold text-left'>
						F
					</label>
					<input
						type='number'
						name='l'
						className='border border-gray-400 rounded'
						disabled
						value={values.l}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='f'
						className='border border-gray-400 rounded '
						value={values.f}
						disabled
					></input>
					<div className='flex justify-center col-span-4 mt-6 space-x-2 space'>
						<Button
							type='submit'
							dark={true}
							type={!isSubmitting && "submit"}
							className={`mt-2 ${isSubmitting && "hover:bg-gray-800"} w-24`}
						>
							{isSubmitting ? (
								<div className='mt-1.5 mb-0.5'>
									<Loader size='small' dark={true} />
								</div>
							) : (
								"Save"
							)}
						</Button>
						<Button className='mt-2' onClick={onClose}>
							Cancel
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default RangeSimpleForm;
